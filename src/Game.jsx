import { useEffect, useState } from 'react'
import './styles/Game.css'


function Header({ HighScore, CurrentScore }) {
    return (
        <header>
            <div className="titleCard">
                <h1>Pokémon Memory Game</h1>
                <p>Score Points by clicking on images. Just don't click what you already clicked!</p>
            </div>
            <div className="scoreBoard">
                <h2>Current Score: {CurrentScore}</h2>
                <h2>High Score: {HighScore}</h2>
            </div>
        </header>
    )
}

function Card({ spriteObject, handleClickFunction }) {
    return (
        <div className='GameCard' onClick={() => handleClickFunction(spriteObject.pokemonName)}>
            <img className='GameCardImage' src={spriteObject.spriteUrl} alt={spriteObject.pokemonName} />
            <p className='GameCardName'>{spriteObject.pokemonName}</p>
        </div>
    )
}

function GameSection({ PokemonSprites, handleClickFunction }) {
    return (
        <div className='GameSection'>
            {PokemonSprites.map((spriteObject) => (
                <Card spriteObject={spriteObject} key={spriteObject.pokemonName} handleClickFunction={handleClickFunction} ></Card>
            ))}
        </div>
    )
}


function Game() {
    const [CurrentScore, updateCurrentScore] = useState(0);
    const [HighScore, updateHighScore] = useState(0);
    const [CurrGameArray, updateCurrGameArray] = useState([]);

    const [PokemonSprites, AddNewPokemon] = useState([]);

    const baseUrl = "https://pokeapi.co/api/v2/pokemon/"
    const PokemonList = [
        "charmander",
        "bulbasaur",
        "squirtle",
        "gastly",
        "pidgey",
        "pikachu",
        "jigglypuff",
        "meowth",
        "psyduck",
        "abra",
        "machop",
        "geodude",
        "magnemite",
        "diglett",
        "slowpoke"
    ];

    useEffect(() => {
        async function fetchSprites() {
            const spriteObjects = await Promise.all(PokemonList.map(name => {
                return fetch(baseUrl + name)
                    .then(res => res.json())
                    .then(json => ({
                        pokemonName: name,
                        spriteUrl: json.sprites.front_default
                    }))
                    .catch(err => {
                        console.log(err);
                        return { pokemonName: name, spriteUrl: '' };
                    })
            }));
            console.log(spriteObjects)
            AddNewPokemon(spriteObjects)
        };
        fetchSprites();
    }, []);


    function shuffleSpritesArray() {
        AddNewPokemon(prev => [...prev].sort(() => Math.random() - 0.5));
    }

    function handleCardClick(PokemonName) {
        shuffleSpritesArray();

        if (CurrGameArray.includes(PokemonName)) {
            if (HighScore < CurrentScore) updateHighScore(CurrentScore);
            updateCurrentScore(0);
            updateCurrGameArray([]);
        } else {
            updateCurrGameArray(prev => [...prev, PokemonName]);
            updateCurrentScore(prev => prev + 1);
        }
    }


    return (
        <>
            <Header HighScore={HighScore} CurrentScore={CurrentScore}></Header>
            <GameSection PokemonSprites={PokemonSprites} handleClickFunction={handleCardClick}></GameSection>
        </>
    )
}

export default Game