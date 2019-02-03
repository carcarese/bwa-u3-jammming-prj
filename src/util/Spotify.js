const client_id = '0302a1fc3b6448e2ac41f690231c6719';
const redirect_uri = "http://localhost:3000/";

let accessToken = '';
let user_id = '';
let playlist_id = '';

const Spotify = {
  getAccessToken() {
    if (accessToken) {
      return accessToken;
    }

   if ((window.location.href.match(/access_token=([^&]*)/)) && (window.location.href.match(/expires_in=([^&]*)/))) {
    let accessTokenTmp = window.location.href.match(/access_token=([^&]*)/);
    let expiresInTmp = window.location.href.match(/expires_in=([^&]*)/);
    accessToken = accessTokenTmp[1];
    let expiresIn = Number(expiresInTmp[1]);
    console.log('the access token is: ', accessToken);
    console.log('expires in: ', expiresIn, ' seg.');

    window.setTimeout(() => accessToken = '', expiresIn * 1000);
    window.history.pushState('Access Token', null, '/');;
    return accessToken;
      } else {
    const redirect = `https://accounts.spotify.com/authorize?client_id=${client_id}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirect_uri}`;
    window.location = redirect;
    }
  },

  search(term) {
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`,
      {
        headers:  {
          Authorization: `Bearer ${accessToken}`,
                  },
                }).then((response) => {
                  return response.json();
                }).then((jsonResponse) => {
                  if (!jsonResponse.tracks) {
                    return [];
                  } else {
          console.log(jsonResponse.tracks);
          return jsonResponse.tracks.items.map((track) =>
          ({
              id: track.id,
              name: track.name,
              artist: track.artists[0].name,
              album: track.album.name,
              uri: track.uri
          })
        );
      }
    })
  },

  savePlaylist(playlistName, trackURIs) {
 		if(!playlistName && !trackURIs) return;
 		accessToken = this.getAccessToken();
 		const headers =  {
       		Authorization: `Bearer ${accessToken}`
     	                };
     	 fetch('https://api.spotify.com/v1/me',
       {
     	    headers: headers
     	  }).then(response => {
 			      return response.json();
 		    }).then(jsonResponse => {
 			      user_id = jsonResponse.id;
 		});
 		fetch(`https://api.spotify.com/v1/users/${user_id}/playlists`,
                  {
                 headers: headers,
                 method: `POST`,
                 body: JSON.stringify({
                 name: playlistName
                  })
         }).then(response => {
           return response.json();
         }).then(jsonResponse => {
         	 playlist_id = jsonResponse.id;
         }).then(() => {
 	        fetch(`https://api.spotify.com/v1/users/${user_id}/playlists/${playlist_id}/tracks`, {
 	                headers: headers,
 	                method: 'POST',
 	                body: JSON.stringify({
 	                uris: trackURIs
 	      })
 			});
    })
 	}
};

export default Spotify;
