import BackToHome from '../component/BackToHome'
import "../assignments/AGS_3.css";
import { useState } from 'react';
 
export default function ASG_3() {

  const [numbers, setNumbers] = useState ([])
  const [inputValue, setInputValue] = useState('')
  const [average, setAverage] = useState(0)
  const [total, setTotal] = useState(0)

  const addNumber = () => {
    const newNumber = parseFloat(inputValue)
    if (!isNaN(newNumber)) {
      const updatedNumbers = [...numbers, newNumber]
      setNumbers(updatedNumbers)
      console.log(updatedNumbers)
      
      const sum = updatedNumbers.reduce((acc, curr) => acc + curr, 0);
      setTotal(sum);
      setAverage(sum / updatedNumbers.length);
      setInputValue('');
    }
  }

  return (
    <>
      <BackToHome/>
      <h1 className="assignment-title">Assignment-3</h1>
      <hr/>
      <br/>
      <label>Enter the Number : </label>
      <input className="input-number" type='number' value={inputValue} onChange={(e)=> setInputValue(e.target.value)}/>
      <button onClick={addNumber}>Add</button>
      <br/>
      <br/>
      <label> All number entered :  {numbers.join(',')}</label>
      <br/>
      <br/>
      <label> TOtal   :{total}</label>
      <br/>
      <label> Average :  {average.toFixed(2)}</label>
    </>
  )
}
