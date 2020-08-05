// Parsing Bandcamp.com
const bandcamp = () => {
	const isTrack = document.location.pathname.match(/\/track/);
	const isAlbum = document.location.pathname.match(/\/album/);
	const audioPlayer = document.querySelectorAll("audio").item(0);

	return {
		parse(record) {
			// validate record

			console.log("paused?", audioPlayer.paused);

			let album = "";
			let song = "";

			if (isTrack) {
				song = document.querySelector('[itemprop="name"]').innerText;
			}

			if (isAlbum) {
				album = document.querySelector('[itemprop="name"]').innerText;

				song = document.querySelector(".title_link").innerText;
			}

			const artist = document.querySelector('[itemprop="byArtist"]').innerText;

			console.log({
				album,
				artist,
				song,
				source: "bandcamp"
			});
		},

		listen() {
			const observer = new MutationObserver(this.parse);
			observer.observe(document.querySelector(".title_link"), {
				characterDataOldValue: true,
				attributes: true,
				subtree: true
			});

			console.log("Listening for bandcamp plays...");

			return () => {
				observer.disconnect();
				console.log("Stopped listening for bandcamp plays.");
			};
		}
	};
};

if (document.location.host.match(/bandcamp\.com/)) {
	bandcamp().parse();
	bandcamp().listen();
}

const soundcloud = () => {
	return {
		parse: record => {
			const song = document
				.querySelector(".playbackSoundBadge__titleLink")
				.children.item(1).innerText;

			const artist = document.querySelector(".playbackSoundBadge__lightLink")
				.innerText;

			console.log({ song, artist, source: "soundcloud" });
		},
		listen() {
			const observer = new MutationObserver(this.parse);

			observer.observe(document.querySelector(".playbackSoundBadge"), {
				characterDataOldValue: true,
				attributes: true,
				subtree: true
			});

			console.log("Listening for soundcloud plays...");

			return () => {
				observer.disconnect();
				console.log("Stopped listening for soundcloud plays.");
			};
		}
	};
};

if (document.location.host === "soundcloud.com") {
	soundcloud().parse();
	soundcloud().listen();
}

// SPOTIFY
// =-.=-.=-.=-.=-.=-.=-.=-.=-.=-.=-.=-.=-.=-.
//
const spotify = () => {
	return {
		parse: record => {
			const info = document.querySelector('[role="contentinfo"]');

			const song = info.querySelector('[data-testid="nowplaying-track-link"]')
				.textContent;

			const coverArtImage = document.querySelector(".cover-art-image").src;

			const nowPlaying = info.attributes["aria-label"].textContent;

			console.log({ song, nowPlaying, coverArtImage, source: "spotify" });
		},
		listen() {
			const observer = new MutationObserver(this.parse);

			observer.observe(document.querySelector('[role="contentinfo"]'), {
				attributes: true
			});

			console.log("Listening for Spotify plays...");

			return () => {
				observer.disconnect();
				console.log("Finish listening for Spotify plays.");
			};
		}
	};
};

if (document.location.host === "open.spotify.com") {
	// site loads with javascript, so we have to wait for the element to load
	const find = async () => {
		const ele = document.querySelector('[role="contentinfo"]');

		if (!ele) {
			return new Promise(resolve => {
				setTimeout(() => resolve(find()), 1000);
			});
		}

		return ele;
	};

	const start = async () => {
		const element = await find();

		spotify().parse();
		spotify().listen();
	};

	start();
}
