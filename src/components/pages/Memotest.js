import React, {useState} from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import './Memotest.css';
import FancyButton from '../small/FancyButton'


const Card = ({ value, onClick = () =>{}, show, isFlipped}) =>{
  return(
    <div onClick={onClick} className={cx('card', {'hidden': !show}, {'covered': !isFlipped}, {'locked': isFlipped})}>
      {value}
    </div>
  )
}


Card.propTypes= {
  value: PropTypes.oneOf([0, 1]),
  onClick: PropTypes.func,
  show: PropTypes.bool.isRequired,
  isFlipped: PropTypes.bool.isRequired,
};


const WinnerCard = ({ show, onRestart = () => {} }) => {
  return (
    <div className={cx('winner-card', { 'winner-card--hidden': !show })}>
      <span className="winner-card-text">
        The game is over!
      </span>
      <FancyButton onClick={onRestart}>Play again?</FancyButton>
    </div>
  );
};


WinnerCard.propTypes = {
  show: PropTypes.bool.isRequired,
  onRestart: PropTypes.func,
}


const shuffleCards = (arrayToShuffle) => {
  let newArr = [];
   arrayToShuffle.forEach(item => newArr.splice(Math.floor(Math.random()*arrayToShuffle.length), 0, item));
   return newArr;
}


const isTheGameOver = (showCards) => {
  return showCards.indexOf(true) === -1 
}


const useMemotestGameState = () =>{
  let gameEnded = false;

  const possibleChoices = [ 0, 0, 1, 1 ];
  let numeros = shuffleCards(possibleChoices)

  const [ firstFlippedCard, setFirstFlippedCard ] = useState();
  const [ shuffledNumbers, setShuffledNumbers ] = useState(numeros)
  const [ showCards, setShowCards ] = useState([true, true, true, true])
  const [ isFlipped, setIsFlipped ] = useState([false, false, false, false])

  if (isTheGameOver(showCards)){
    gameEnded = true;
  }

  const flipCard = (card) => {
    let arr = [...isFlipped]
    arr[card] = true
    setIsFlipped(arr)

    if (isFlipped.indexOf(true) === -1){
      setFirstFlippedCard(card)
    }
    else{
      if (shuffledNumbers[firstFlippedCard] !== shuffledNumbers[card] && card !== firstFlippedCard){
        setTimeout(()=>{
          let tempArray = [...isFlipped]
          tempArray[firstFlippedCard] = false
          tempArray[card] = false
          setIsFlipped(tempArray)
        }, 1000)
      }
      else{
        let tempArray = [...showCards]
        let tempArray2 = [...isFlipped]
        tempArray2[card] = tempArray[card] = false
        tempArray2[firstFlippedCard] = tempArray[firstFlippedCard] = false
        setIsFlipped(tempArray2)
        setShowCards(tempArray)
      }
    }
  }

  const restart = () =>{
    let newArr = [false, false, false, false]
    setIsFlipped(newArr)
    numeros = shuffleCards(possibleChoices, [])
    setShuffledNumbers(numeros)
    
    let newArr2 = [true, true, true, true]
    setShowCards(newArr2)
    gameEnded = false
  }

  return {flipCard, shuffledNumbers, showCards, restart, gameEnded, isFlipped};
}



const Memotest = () => {
  const { flipCard, shuffledNumbers, showCards, restart, gameEnded, isFlipped} = useMemotestGameState()
  
  return(
    <div className="memotest">
      <WinnerCard show={gameEnded} onRestart={restart}/>
      <div className="memotest-row">
        <Card value={shuffledNumbers[0]} onClick={()=>flipCard(0)} show={showCards[0]} isFlipped={isFlipped[0]}/>
        <Card value={shuffledNumbers[1]} onClick={()=>flipCard(1)} show={showCards[1]} isFlipped={isFlipped[1]}/>
      </div>
      <div className="memotest-row">
        <Card value={shuffledNumbers[2]} onClick={()=>flipCard(2)} show={showCards[2]} isFlipped={isFlipped[2]}/>
        <Card value={shuffledNumbers[3]} onClick={()=>flipCard(3)} show={showCards[3]} isFlipped={isFlipped[3]}/>
      </div>
    </div>
  )
}

export default Memotest;
