import BackToHome from "../component/BackToHome";
import "../assignments/ASG_53.css";
import { useState, useEffect, useRef } from "react";

export default function ASG_53() {

	const GRID_SIZE = 8;

	// words loaded from public/asg53/word-jumble.json
	const [wordsList, setWordsList] = useState(null);
	const [loadError, setLoadError] = useState(null);

	const [grid, setGrid] = useState(() => Array.from({length: GRID_SIZE}, ()=> Array(GRID_SIZE).fill(null)));
	const [addedWords, setAddedWords] = useState([]); // {word, coords:[{x,y}, ...]}
	const [answers, setAnswers] = useState([]); // will contain 10 items: placed words + decoys
	const [selectedCoords, setSelectedCoords] = useState([]); // sequence of {x,y}
	const [foundWords, setFoundWords] = useState(new Set());

	const [isDragging, setIsDragging] = useState(false);
	const [selectionValid, setSelectionValid] = useState(true);

	const dragRef = useRef(false);

	// --- NEW: track when an answer-word (from the right column) is being dragged ---
	const [dragAnswer, setDragAnswer] = useState(null); // { word, coords } or null
	const dragAnswerDirRef = useRef(null); // "forward" | "reverse" | null

	function randInt(min, max) { // inclusive min, inclusive max
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	function pickRandom(arr) {
		return arr[randInt(0, arr.length - 1)];
	}

	// helper: pick n unique random items from arr (without mutating arr)
	function pickNUnique(arr, n) {
		const copy = arr.slice();
		const result = [];
		while (result.length < n && copy.length > 0) {
			const idx = randInt(0, copy.length - 1);
			result.push(copy.splice(idx, 1)[0]);
		}
		return result;
	}
	
	// helper: shuffle
	function shuffle(arr) {
		for (let i = arr.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[arr[i], arr[j]] = [arr[j], arr[i]];
		}
		return arr;
	}

	function generateEmptyGrid() {
		return Array.from({length: GRID_SIZE}, ()=> Array(GRID_SIZE).fill(null));
	}

	function generatePuzzleFromWords(poolWords) {
		// poolWords is an array of uppercase words
		const pool = poolWords.slice();
		const g = generateEmptyGrid();
		const added = [];
		let direction = Math.random() < 0.5 ? "horizontal" : "vertical";
		let attempts = 0;
		while (added.length < 8 && attempts < 2000 && pool.length > 0) {
			attempts++;
			let startX, startY, maxLen, minLen = 3;
			if (direction === "horizontal") {
				startX = randInt(0, GRID_SIZE - minLen);
				startY = randInt(0, GRID_SIZE - 1);
				maxLen = GRID_SIZE - startX;
			} else {
				startX = randInt(0, GRID_SIZE - 1);
				startY = randInt(0, GRID_SIZE - minLen);
				maxLen = GRID_SIZE - startY;
			}
			if (maxLen < minLen) {
				direction = direction === "horizontal" ? "vertical" : "horizontal";
				continue;
			}
			const length = randInt(minLen, Math.min(8, maxLen));
			const positions = [];
			for (let i = 0; i < length; i++) {
				const x = direction === "horizontal" ? startX + i : startX;
				const y = direction === "horizontal" ? startY : startY + i;
				positions.push({x, y});
			}
			const matches = pool.filter(word => {
				if (word.length !== length) return false;
				for (let i = 0; i < length; i++) {
					const {x, y} = positions[i];
					const cell = g[y][x];
					if (cell && cell !== word[i]) return false;
				}
				return true;
			});
			if (matches.length === 0) {
				direction = direction === "horizontal" ? "vertical" : "horizontal";
				continue;
			}
			const chosen = pickRandom(matches);
			for (let i = 0; i < length; i++) {
				const {x, y} = positions[i];
				g[y][x] = chosen[i];
			}
			added.push({ word: chosen, coords: positions });
			const idx = pool.indexOf(chosen);
			if (idx > -1) pool.splice(idx, 1);
			direction = direction === "horizontal" ? "vertical" : "horizontal";
		}

		// Fill remaining nulls with random letters (A-Z)
		for (let y = 0; y < GRID_SIZE; y++) {
			for (let x = 0; x < GRID_SIZE; x++) {
				if (!g[y][x]) g[y][x] = String.fromCharCode(65 + randInt(0, 25));
			}
		}

		return { grid: g, added };
	}

	// load words JSON on mount
	useEffect(() => {
		fetch("/asg53/word-jumble.json")
			.then(res => res.json())
			.then(obj => {
				// JSON is object with numeric keys; convert to unique uppercase array
				const arr = Object.values(obj).map(v => String(v).toUpperCase());
				const uniq = Array.from(new Set(arr));
				setWordsList(uniq);
				setLoadError(null);
			})
			.catch((err) => {
				// Make this fully dynamic: do NOT inject a hard-coded fallback.
				// Surface the error and set an empty list so generation is skipped.
				console.error("Failed to load word list:", err);
				setWordsList([]);
				setLoadError("Failed to load word list. Check network or /asg53/word-jumble.json");
			});
	}, []);

	// generate puzzle after words list is loaded
	useEffect(() => {
			// Only generate when we have a non-empty words list
			if (!wordsList || wordsList.length === 0) return;
			const {grid: g, added} = generatePuzzleFromWords(wordsList);
			setGrid(g);
			setAddedWords(added);
			setFoundWords(new Set());
			setSelectedCoords([]);
			// Build answers array with 10 entries: placed words + decoys
			{
				const placedWords = added.map(a => a.word);
				const remainingPool = wordsList.filter(w => !placedWords.includes(w));
				const need = Math.max(0, 10 - placedWords.length);
				const decoys = pickNUnique(remainingPool, need).map(w => ({ word: w, coords: null }));
				const placedItems = added.map(a => ({ word: a.word, coords: a.coords }));
				setAnswers(shuffle([...placedItems, ...decoys]).slice(0, 10));
			}
 		}, [wordsList]);

		function restart() {
			if (!wordsList || wordsList.length === 0) return;
 			const {grid: g, added} = generatePuzzleFromWords(wordsList);
 			setGrid(g);
 			setAddedWords(added);
 			setFoundWords(new Set());
 			setSelectedCoords([]);
 			setSelectionValid(true);
			// regenerate answers (10)
			{
				const placedWords = added.map(a => a.word);
				const remainingPool = wordsList.filter(w => !placedWords.includes(w));
				const need = Math.max(0, 10 - placedWords.length);
				const decoys = pickNUnique(remainingPool, need).map(w => ({ word: w, coords: null }));
				const placedItems = added.map(a => ({ word: a.word, coords: a.coords }));
				setAnswers(shuffle([...placedItems, ...decoys]).slice(0, 10));
			}
 		}

	function coordsEqual(a, b) {
		return a.x === b.x && a.y === b.y;
	}

	// check whether current selection is a prefix of any added word coords (forward or reversed)
	function selectionIsPrefix(selection) {
		if (!selection.length) return true;
		for (const item of addedWords) {
			const forward = item.coords;
			const reverse = item.coords.slice().reverse();
			// check prefix forward
			let okF = true;
			for (let i = 0; i < selection.length; i++) {
				if (!coordsEqual(selection[i], forward[i])) { okF = false; break; }
			}
			if (okF) return true;
			// check prefix reverse
			let okR = true;
			for (let i = 0; i < selection.length; i++) {
				if (!coordsEqual(selection[i], reverse[i])) { okR = false; break; }
			}
			if (okR) return true;
		}
		return false;
	}

	// when selection completes (on drop), check full match and mark found or reset
	function finalizeSelection(selection) {
		if (!selection.length) return;
		for (const item of addedWords) {
			if (foundWords.has(item.word)) continue;
			// compare full sequence (either forward or reverse)
			if (selection.length !== item.coords.length) continue;
			const forwardMatch = item.coords.every((c,i) => coordsEqual(c, selection[i]));
			const reverseMatch = item.coords.slice().reverse().every((c,i) => coordsEqual(c, selection[i]));
			if (forwardMatch || reverseMatch) {
				setFoundWords(prev => new Set(prev).add(item.word));
				setSelectedCoords([]);
				setSelectionValid(true);
				return;
			}
		}
		// not a correct word -> reset selection and briefly show invalid state
		setSelectionValid(false);
		// keep invalid state visible for a short moment then reset
		setTimeout(() => {
			setSelectedCoords([]);
			setSelectionValid(true);
		}, 350);
	}

	// Drag handlers
	function onDragStartCell(e, x, y) {
		dragRef.current = true;
		setIsDragging(true);
		const start = [{x,y}];
		setSelectedCoords(start);
		// optional data to enable drop on some browsers
		try { e.dataTransfer.setData("text/plain", `${x},${y}`); } catch(e) {}
		// set selection validity
		setSelectionValid(selectionIsPrefix(start));
	}

	function onDragOverCell(e, x, y) {
		// if dragging from answers, we must follow that word's coords order
		if (!dragRef.current) return;
		e.preventDefault(); // allow drop
		// If dragging an answer-word
		if (dragAnswer) {
			// if answer has no coords (decoy) we cannot form a valid selection
			if (!dragAnswer.coords) {
				setSelectionValid(false);
				return;
			}
 			setSelectedCoords(prev => {
 				// if already contains this cell, ignore
 				if (prev.some(c => c.x===x && c.y===y)) return prev;
 				const forward = dragAnswer.coords;
 				const reverse = forward.slice().reverse();
 				let nextIndex = prev.length;
 				// choose direction if not chosen yet
 				if (!dragAnswerDirRef.current) {
 					if (coordsEqual({x,y}, forward[0])) {
 						dragAnswerDirRef.current = "forward";
 					} else if (coordsEqual({x,y}, reverse[0])) {
 						dragAnswerDirRef.current = "reverse";
 					} else {
 						// invalid start for this answer; ignore the cell
 						return prev;
 					}
 					nextIndex = 0;
 				}
 				const dir = dragAnswerDirRef.current;
 				const expected = dir === "forward" ? forward[nextIndex] : reverse[nextIndex];
 				if (!expected) return prev;
 				if (coordsEqual(expected, {x,y})) {
 					const next = [...prev, {x,y}];
 					setSelectionValid(true);
 					return next;
 				}
 				// invalid continuation -> mark invalid but do not append
 				setSelectionValid(false);
 				return prev;
 			});
 			return;
 		}

		// --- previous behavior when dragging directly across grid (letters) ---
		setSelectedCoords(prev => {
			const exists = prev.some(c => c.x===x && c.y===y);
			if (exists) return prev;
			const next = [...prev, {x,y}];
			setSelectionValid(selectionIsPrefix(next));
			return next;
		});
	}

	function onDropCell(e, x, y) {
		e.preventDefault();
		dragRef.current = false;
		setIsDragging(false);

		if (dragAnswer) {
			// ensure final cell appended if it matches next expected
			setSelectedCoords(prev => {
				const exists = prev.some(c => c.x===x && c.y===y);
				const final = exists ? prev : [...prev, {x,y}];
				// finalize selection which will validate against the dragged answer coords
				finalizeSelection(final);
				return final;
			});
			// clear drag answer state
			setDragAnswer(null);
			dragAnswerDirRef.current = null;
			return;
		}

		// previous behavior for normal drag
		setSelectedCoords(prev => {
			const exists = prev.some(c => c.x===x && c.y===y);
			const final = exists ? prev : [...prev, {x,y}];
			finalizeSelection(final);
			return final;
		});
	}

	function onDragEndCell() {
		dragRef.current = false;
		setIsDragging(false);
		// finalize using whatever selection we have
		finalizeSelection(selectedCoords);
	}

	// --- NEW: drag handlers for answer items (words) ---
	function onDragStartAnswer(e, item) {
		dragRef.current = true;
		setIsDragging(true);
		setDragAnswer(item);
		dragAnswerDirRef.current = null;
		setSelectedCoords([]);
		try { e.dataTransfer.setData("text/plain", item.word); } catch (err) {}
		// if it's a decoy (no coords) mark selection invalid until user drops (no match possible)
		setSelectionValid(Boolean(item.coords));
	}

	function onDragEndAnswer() {
		dragRef.current = false;
		setIsDragging(false);
		setDragAnswer(null);
		dragAnswerDirRef.current = null;
		// finalize selection if any (will validate)
		finalizeSelection(selectedCoords);
	}
	
	// click/tap selection (keep previous click behavior)
	function toggleSelectCell(x, y) {
		const idx = selectedCoords.findIndex(c => coordsEqual(c, {x,y}));
		if (idx !== -1) {
			if (idx === selectedCoords.length - 1) {
				setSelectedCoords(prev => prev.slice(0, -1));
			}
			return;
		}
		const next = [...selectedCoords, {x,y}];
		setSelectedCoords(next);
		setSelectionValid(selectionIsPrefix(next));
		// attempt immediate finalize if selection equals any word length and coords match
		setTimeout(() => finalizeSelection(next), 0);
	}

  return (
    <div className="asg53">
      <BackToHome />
      <h1 className="assignment-title">Assignment-53</h1>
      <hr />
      <br />
      {loadError && <div className="load-error" role="alert">{loadError}</div>}
      <br />

      <div className="container-asg53">
        <div className="puzzle-asg53">
		  { /* render grid rows */ }
		  {grid.map((row, y) => (
			<div key={y} className="puzzle-asg53-row">
			  {row.map((cell, x) => {
				// determine classes
				const isSelected = selectedCoords.some(c => c.x === x && c.y === y);
				let isFound = false;
				for (const w of addedWords) {
					if (foundWords.has(w.word)) {
						if (w.coords.some(c => c.x === x && c.y === y)) {
							isFound = true; break;
						}
					}
				}
				const invalidClass = isSelected && !selectionValid ? " invalid" : "";
				return (
				  <div
					key={x}
					className={
					  "puzzle-asg53-letter" +
					  (isSelected ? " selected" : "") +
					  (isFound ? " found" : "") +
					  invalidClass
					}
					draggable
					onDragStart={(e)=>onDragStartCell(e,x,y)}
					onDragOver={(e)=>onDragOverCell(e,x,y)}
					onDrop={(e)=>onDropCell(e,x,y)}
					onDragEnd={onDragEndCell}
					onClick={()=>toggleSelectCell(x,y)}
					role="button"
					aria-label={`cell-${x}-${y}`}
				  >
					{cell}
				  </div>
				);
			  })}
			</div>
		  ))}
        </div>
        <div className="options-asg53" >
          <div className="answers-asg53">
			{ /* show 10 answers (placed + decoys) */ }
			{answers.map((item, idx) => {
				const found = foundWords.has(item.word);
				return (
					<div
						key={idx}
						className="answer-asg53-item"
						data-found={found}
						draggable={!found}
						onDragStart={(e)=> onDragStartAnswer(e, item)}
						onDragEnd={onDragEndAnswer}
					>
						{item.word}
					</div>
				);
			})}
          </div>
          <button className="button-asg53" onClick={restart} disabled={!wordsList || wordsList.length === 0}>Shuttle Words</button>
        </div>
      </div>

    </div>
  );
}