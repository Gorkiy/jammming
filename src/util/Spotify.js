let accessToken = '';
const clientId = '39c11e0aad5344df9a592ad2bb09513b';
const redirectURI = 'http://villa-jammming.surge.sh';
// const redirectURI = 'http://localhost:3000/';

const Spotify = {
  getAccessToken() {
    if (accessToken !== '') {
      return accessToken;
    }

    const access_token = window.location.href.match(/access_token=([^&]*)/);
    const expires_in = window.location.href.match(/expires_in=([^&]*)/);

    if (access_token && expires_in) {
      accessToken = access_token[1];
      const expiresIn = expires_in[1];
      window.setTimeout(() => accessToken = '', expiresIn * 1000);
      window.history.pushState('Access Token', null, '/');
      return accessToken;
    }
    else {
      const scope = 'playlist-modify-public';
      let url = 'https://accounts.spotify.com/authorize';
      url += '?response_type=token';
      url += '&client_id=' + encodeURIComponent(clientId);
      url += '&scope=' + encodeURIComponent(scope);
      url += '&redirect_uri=' + encodeURIComponent(redirectURI);
      window.location = url;
    }
  },

  search(searchTerm){
    let access_token = this.getAccessToken();
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${searchTerm}`,
    {
      headers: {Authorization: `Bearer ${access_token}`}
    }).then(response => {
      if(response.ok){
        return response.json();
      }
      throw new Error('Request failed!');
    }, networkError => console.log(networkError.message)
    ).then(jsonResponse => {
      return jsonResponse.tracks.items.map(track => (
        {
          id: track.id,
          name: track.name,
          artist: track.artists[0].name,
          album: track.album.name,
          uri: track.uri
        }
      )
      );
    });
  },

  savePlaylist(playlistName, trackURIs){
    if(!playlistName || !trackURIs){
      return;
    }
    let access_token = this.getAccessToken();
    let userID;
    let playlistID;

    return fetch(`https://api.spotify.com/v1/me`,
      {
        headers: {Authorization: `Bearer ${access_token}`}
      }).then(response => {
        if(response.ok){
          return response.json();
        }
        throw new Error('Request failed!');
      }, networkError => console.log(networkError.message)
    ).then(jsonResponse => {
      userID = jsonResponse.id;

      fetch(`https://api.spotify.com/v1/users/${userID}/playlists`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
          body: JSON.stringify(
            {
              name: playlistName,
              description: 'New playlist description'
            }
          )
        }).then(response => {
          if (response.ok) {
            return response.json();
          }
          throw new Error('Request failed!');
        }, networkError => console.log(networkError.message)
      ).then(jsonResponse => {
        playlistID = jsonResponse.id;

        fetch(`https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}/tracks`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
          body: JSON.stringify(
            {
              uris: trackURIs
            }
          )
        }).then(response => {
          if (response.ok) {
            return response.json();
          }
          throw new Error('Request failed!');
        }, networkError => console.log(networkError.message)
      ).then(jsonResponse => {}
      );
      });
    });
  }

};

export default Spotify;
