import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableNativeFeedback,
} from 'react-native';
import { Icon } from 'react-native-elements';

const App: () => React$Node = () => {
  const [gameState, setGameState] = useState([[], [], []]);
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [gameIsOver, setGameIsOver] = useState(false);
  const [winner, setWinner] = useState(0);
  const [humanVsAi, setHumanVsAi] = useState(true);

  useEffect(() => {
    startGame(true);
  }, []);

  const startGame = (humanVsAi) => {
    setGameState(
        [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0]
        ]
    );
    setCurrentPlayer(1);
    setGameIsOver(false);
    setWinner(0);
    setHumanVsAi(humanVsAi)
  }

  const getWinner = () => {
      const tilesRequiredToWin = 3;
      let sum;
      let currentGameState = gameState.slice();

      for (let i = 0; i < tilesRequiredToWin; i++) {
          sum = currentGameState[i][0] + currentGameState[i][1] + currentGameState[i][2];
          if (sum === 3) {
              return 1;
          } else if (sum === -3) {
              return -1;
          }
      }

      for (let i = 0; i < tilesRequiredToWin; i++) {
          sum = currentGameState[0][i] + currentGameState[1][i] + currentGameState[2][i];
          if (sum === 3) {
              return 1;
          } else if (sum === -3) {
              return -1;
          }
      }

      sum = currentGameState[0][0] + currentGameState[1][1] + currentGameState[2][2];
      if (sum === 3) {
          return 1;
      } else if (sum === -3) {
          return -1;
      }

      sum = currentGameState[2][0] + currentGameState[1][1] + currentGameState[0][2];
      if (sum === 3) {
          return 1;
      } else if (sum === -3) {
          return -1;
      }

      return 0;
  }

  const checkTie = () => {
      let gameIsTie = false;
      let currentGameState = gameState.slice();
      let tilesPressed = 0;

      for (let i = 0; i < currentGameState.length; i++) {
          for (let j = 0; j < currentGameState.length; j++) {
              if (currentGameState[i][j] !== 0) {
                  tilesPressed += 1;
              }
          }
      }

      if (tilesPressed === 9) {
          gameIsTie = true;
      }

      return gameIsTie;
  }

  const checkGame = () => {
      const winner = getWinner();
      let gameIsOver = false;

      if (winner === 1) {
          setGameIsOver(true);
          setWinner(1);
          gameIsOver = true;
      } else if (winner === -1) {
          setGameIsOver(true);
          setWinner(-1);
          gameIsOver = true;
      } else {
          const gameIsTie = checkTie();
          if (gameIsTie) {
              setGameIsOver(true);
              gameIsOver = true;
          }
      }

      return gameIsOver;
  }

  const playAiTurn = () => {
      const min = 0;
      const max = 2;

      while (true) {
          const currentGameState = gameState.slice();
          let i = Math.floor(Math.random() * (max - min + 1)) + min;
          let j = Math.floor(Math.random() * (max - min + 1)) + min;
          if (currentGameState && currentGameState[i][j] === 0) {
              const updatedGameState = currentGameState;
              updatedGameState[i][j] = -1;
              setGameState(updatedGameState);
              break;
          }
      }

      //for (let i = 0; i < currentGameState.length; i++) {
      //    for (let j = 0; j < currentGameState.length; j++) {
      //        if (currentGameState[i][j] === 0) {
      //            const updatedGameState = currentGameState;
      //            updatedGameState[i][j] = -1;
      //            setGameState(updatedGameState)
      //            return;
      //        }
      //    }
      //}
  }

  const pressTile = (row, col, humanVsAi) => {
      const pressedTile = gameState[row][col];

      if (humanVsAi) {
          if (pressedTile === 0 && !gameIsOver) {
              const updatedGameState = gameState.slice();

              updatedGameState[row][col] = 1;
              setGameState(updatedGameState);
              const gameIsOver = checkGame();
              if (!gameIsOver) {
                  playAiTurn();
                  checkGame();
              }      
          }
      } else {
          if (pressedTile === 0 && !gameIsOver) {
              const updatedGameState = gameState.slice();

              updatedGameState[row][col] = currentPlayer;
              setGameState(updatedGameState);

              const nextPlayer = (currentPlayer == 1) ? -1 : 1;
              setCurrentPlayer(nextPlayer);
          }

          const winner = getWinner();

          if (winner === 1) {
              setGameIsOver(true);
              setWinner(1);
          } else if (winner === -1) {
              setGameIsOver(true);
              setWinner(-1);
          } else {
              const gameIsOver = checkTie();
              if (gameIsOver) {
                  setGameIsOver(true);
              }
          }
      }
  }

  const renderIcon = (row, col) => {
      const value = gameState[row][col];
      switch (value) {
          case 1: 
              return (
                  <Icon
                      color='red'
                      size={100}
                      name='x'
                      type='feather'
                      containerStyle={styles.cross}
                  />
              );
          case -1:
              return (
                  <Icon
                      color='blue'
                      size={80}
                      name='circle'
                      type='feather'
                      containerStyle={styles.nought}
                  />
              );
          default:
              return null;
      }
  }

  const renderGameOverMessage = (humanVsAi) => {
      switch (winner) {
          case 1:
              return (
                  <View style={styles.gameOverMessageContainer}>
                      <Text>Game over</Text>
                      <Text>Player 1 won!</Text>
                  </View>
              );
          case -1:
              return (
                  <View style={styles.gameOverMessageContainer}>
                      <Text>Game over</Text>
                      {
                          (humanVsAi) ?
                          <Text>AI won!</Text>
                          :
                          <Text>Player 2 won!</Text>
                      }
                  </View>
              );
          default:
              return (
                  <View style={styles.gameOverMessageContainer}>
                      <Text>Game over</Text>
                      <Text>The game ended in a draw!</Text>
                  </View>
              );
      }
  }

  return (
    <View style={styles.container}>
      {
          (gameIsOver) &&
              <View>
                  {renderGameOverMessage(humanVsAi)}
              </View>
      }
      <View style={{ flexDirection: 'row' }}>
          <TouchableNativeFeedback 
              onPress={() => pressTile(0, 0, humanVsAi)} 
              disabled={gameIsOver}>
              <View style={[styles.tile, { borderLeftWidth: 0, borderTopWidth: 0 }]}>
                  {renderIcon(0, 0)}
              </View>
          </TouchableNativeFeedback>
          <TouchableNativeFeedback 
              onPress={() => pressTile(0, 1, humanVsAi)}
              disabled={gameIsOver}>
              <View style={[styles.tile, { borderTopWidth: 0 }]}>
                  {renderIcon(0, 1)}
              </View>
          </TouchableNativeFeedback>
          <TouchableNativeFeedback 
              onPress={() => pressTile(0, 2, humanVsAi)} 
              disabled={gameIsOver}>
              <View style={[styles.tile, { borderRightWidth: 0, borderTopWidth: 0 }]}>
                  {renderIcon(0, 2)}
              </View>
          </TouchableNativeFeedback>
      </View>
      <View style={{ flexDirection: 'row' }}>
          <TouchableNativeFeedback 
              onPress={() => pressTile(1, 0, humanVsAi)} 
              disabled={gameIsOver}>
              <View style={[styles.tile, { borderLeftWidth: 0 }]}>
                  {renderIcon(1, 0)}
              </View>
          </TouchableNativeFeedback>
          <TouchableNativeFeedback 
              onPress={() => pressTile(1, 1, humanVsAi)} 
              disabled={gameIsOver}>
              <View style={styles.tile}>
                  {renderIcon(1, 1)}
              </View>
          </TouchableNativeFeedback>
          <TouchableNativeFeedback 
              onPress={() => pressTile(1, 2, humanVsAi)} 
              disabled={gameIsOver}>
              <View style={[styles.tile, { borderRightWidth: 0 }]}>
                  {renderIcon(1, 2)}
              </View>
          </TouchableNativeFeedback>
      </View>
      <View style={{ flexDirection: 'row' }}>
          <TouchableNativeFeedback 
              onPress={() => pressTile(2, 0, humanVsAi)} 
              disabled={gameIsOver}>
              <View style={[styles.tile, { borderLeftWidth: 0, borderBottomWidth: 0 }]}>
                  {renderIcon(2, 0)}
              </View>
          </TouchableNativeFeedback>
          <TouchableNativeFeedback 
              onPress={() => pressTile(2, 1, humanVsAi)} 
              disabled={gameIsOver}>
              <View style={[styles.tile, { borderBottomWidth: 0 }]}>
                  {renderIcon(2, 1)}
              </View>
          </TouchableNativeFeedback>
          <TouchableNativeFeedback 
              onPress={() => pressTile(2, 2, humanVsAi)} 
              disabled={gameIsOver}>
              <View style={[styles.tile, { borderRightWidth: 0, borderBottomWidth: 0 }]}>
                  {renderIcon(2, 2)}
              </View>
          </TouchableNativeFeedback>
      </View>
      <TouchableNativeFeedback onPress={() => startGame(humanVsAi)}>
          <View style={{ padding: '5%', margin: '10%', backgroundColor: 'powderblue', borderRadius: 10 }}>
              <Text style={{  }}>New Game</Text>
          </View>
      </TouchableNativeFeedback>
      <View style={{ flexDirection: 'row' }}>
          <TouchableNativeFeedback onPress={() => startGame(false)}>
              <View style={{ padding: '5%', margin: '5%', backgroundColor: 'powderblue', borderRadius: 10 }}>
                  <Icon type='material' name='people'></Icon>
              </View>
          </TouchableNativeFeedback>
          <TouchableNativeFeedback onPress={() => startGame(true)}>
              <View style={{ padding: '5%', margin: '5%', backgroundColor: 'powderblue', borderRadius: 10 }}>
                  <Icon type='material-community' name='android-head'></Icon>
              </View>
          </TouchableNativeFeedback>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({

  container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#F5FCFF',
  },

  tile: {
      borderWidth: 1,
      width: 100,
      height: 100
  },

  cross: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center'
  },

  nought: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center'
  },

  gameOverMessageContainer: {
      paddingBottom: '10%',
      justifyContent: 'center',
      alignItems: 'center' 
  }
});

export default App;
