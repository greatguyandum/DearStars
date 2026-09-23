import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Pressable, Dimensions, useWindowDimensions, Image } from 'react-native';
import { Linking } from 'react-native';
import { Audio } from 'expo-av';

const { width: dynamicWidth, height: dynamicHeight } = useWindowDimensions();
const liveCountChocula = 4;

export default function StarGame() {
  const [spoted, setSpoted] = useState(0);
  const [lives, setLives] = useState(liveCountChocula);
  const [stars, setStars] = useState([]);
  const [sound, setSound] = useState();

  useEffect(() => {
  let playbackObject = null;

  async function loadAndPlaySound() {
    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
      });
      const result = await Audio.Sound.createAsync(
        require('./OutofMyDreams.mp3'),
        { shouldPlay: true, isLooping: true }
      );
      playbackObject = result.sound;
      setSound(playbackObject);
    } catch (error) {
      console.log("Failed to load sound", error);
    }
  }

  loadAndPlaySound();

  return () => {
    if (playbackObject) {
      playbackObject.unloadAsync();
    }
  };
}, []);
  
  useEffect(() => {
    if (lives <= 0) return;
    
    const interval = setInterval(() => {
      const newStar = {
        id: Date.now().toString(),
        x: Math.random() * (dynamicWidth - 60),
        y: Math.random() * (dynamicHeight - 110), // Bruuuuuh,
        appearSpd: Math.random() * 10
        // Não sei fazer cor aleatoria
      };

      setStars((prevStars) => [...prevStars, newStar]);

      setTimeout(() => {
        setStars((prevStars) => {
          const exists = prevStars.some(star => star.id === newStar.id);
          if (exists) {
            setLives((l) => Math.max(0, l - 1));
          }
          return prevStars.filter((star) => star.id !== newStar.id);
        });
      }, 2000);

    }, 1200);

    return () => clearInterval(interval);
  }, [lives]);

  const handleTapStar = (id) => {
    setSpoted((s) => s + 1);
    setStars((prevStars) => prevStars.filter((star) => star.id !== id));
  };

  return (
    <View style={styles.container}>
      <Image 
        source={{ uri: 'https://live.staticflickr.com/5173/5436446554_9244788c36_b.jpg' }} 
        style={styles.image} 
        resizeMode="cover"
      />
      <View style={styles.hud}>
        <Text style={styles.hudText}>Estrelas vistas: {spoted}</Text>
        <Text style={styles.hudText}>Chances: {'❤️'.repeat(lives)}</Text>
      </View>

      
      {lives > 0 ? (
        <View style={styles.gameArea}>
          {stars.map((star) => (
            <Pressable
              key={star.id}
              style={[styles.star, { top: star.y, left: star.x }]}
              onPress={() => handleTapStar(star.id)}
            >
              <Text style={styles.starIcon}>🌟</Text>
            </Pressable>
          ))}
        </View>
      ) : (
        <View style={styles.gameOverContainer}>
          <Text style={styles.gameOverText}>Game Over</Text>
          <Text style={styles.hudText}>Total de estrelas vistas: {spoted}</Text>
          <Pressable style={styles.button} onPress={() => { setSpoted(0); setLives(liveCountChocula); setStars([]); }}>
            <Text style={styles.buttonText}>Outra chance</Text>
          </Pressable>
          <Pressable style={styles.button} onPress={() => { Linking.openURL( 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' ); }}>
            <Text style={styles.buttonText}>Desistir</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#0B0B19' 
  },
  hud: { 
    gap: 16,
    padding: 50, 
    paddingTop: 60 
  },
  hudText: { 
    color: '#FFF', 
    fontSize: 18, 
    fontWeight: 'bold' 
  },
  gameArea: { 
    flex: 1, 
    position: 'relative' 
  },
  star: { 
    position: 'absolute', 
    padding: 10 
  },
  starIcon: { 
    fontSize: 32 
  },
  gameOverContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  gameOverText: { color: '#FF5555', 
    fontSize: 32, 
    fontWeight: 'bold', 
    marginBottom: 20 
  },
  button: { 
    marginTop: 20, 
    backgroundColor: '#f02ee0', 
    padding: 15, 
    borderRadius: 10 
  },
  button: { 
    marginTop: 20, 
    backgroundColor: '#e2df46', 
    padding: 15, 
    borderRadius: 10 
  },
  buttonText: { 
    color: '#FFF', 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
  image: {
    // Dimensões obrigatórias para imagens remotas (BRUH)
    width: dynamicWidth,
    height: dynamicHeight,
    borderRadius: 8,
    position: 'absolute'
  },
});

