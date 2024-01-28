import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const HomeScreen = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {

        const storedData = await AsyncStorage.getItem('cachedData');
        if (storedData) {
          setPhotos(JSON.parse(storedData));
        }

      
        const response = await axios.get(
          'https://api.flickr.com/services/rest/?method=flickr.photos.getRecent&per_page=20&page=1&api_key=6f102c62f41998d151e5a1b48713cf13&format=json&nojsoncallback=1&extras=url_s'
        );

        setPhotos(response.data.photos.photo);
        AsyncStorage.setItem('cachedData', JSON.stringify(response.data.photos.photo));
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <View style={{ flex: 1, padding: 16, marginTop: 18 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>Recent Images</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={photos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={{ marginBottom: 16 }}>
              <Image
                source={{ uri: item.url_s }}
                style={{ width: '100%', height: 200, borderRadius: 8 }}
              />
            </View>
          )}
        />
      )}
    </View>
  );
};

export default HomeScreen;
