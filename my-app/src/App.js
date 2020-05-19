import React, { Component } from 'react';

class App extends Component {

  constructor(props) {
    super(props);
  }

  downloadBlob(blob, filename) {
    // Create an object URL for the blob object
    const url = URL.createObjectURL(blob);

    // Create a new anchor element
    const a = document.createElement('a');

    // Set the href and download attributes for the anchor element
    // You can optionally set other attributes like `title`, etc
    // Especially, if the anchor element will be attached to the DOM
    a.href = url;
    a.download = filename || 'download';

    // Click handler that releases the object URL after the element has been clicked
    // This is required for one-off downloads of the blob content
    const clickHandler = () => {
      setTimeout(() => {
        URL.revokeObjectURL(url);
        this.removeEventListener('click', clickHandler);
      }, 150);
    };

    // Add the click event listener on the anchor element
    // Comment out this line if you don't want a one-off download of the blob content
    a.addEventListener('click', clickHandler, false);

    // Programmatically trigger a click on the anchor element
    // Useful if you want the download to happen automatically
    // Without attaching the anchor element to the DOM
    // Comment out this line if you don't want an automatic download of the blob content
    a.click();

    // Return the anchor element
    // Useful if you want a reference to the element
    // in order to attach it to the DOM or use it in some other way
    return a;
  }

  showFile = async (e) => {
    e.preventDefault()
    const reader = new FileReader()
    reader.onload = async (e) => {
      const text = (e.target.result)
      let myObj = JSON.parse(text);
      let places = myObj.timelineObjects
        .filter((entry) => entry.placeVisit)
        .map(place => { return { location: place.placeVisit.location, duration: place.placeVisit.duration } })

      let filteredPlaces = places.filter(entry => (entry.location.name && entry.location.name.includes(this.state.location)))
      let csvResult = "lfdNr,Datum,Ort,Dauer\n";
      filteredPlaces.forEach((entry, index) => {
        let startDate = new Date(Number(entry.duration.startTimestampMs));
        let endDate = new Date(Number(entry.duration.endTimestampMs));

        let durationInMillis = endDate.getTime() -startDate.getTime();
        let hours = Math.floor(durationInMillis / 3600000);
        let remainingMillis = durationInMillis % 3600000;
        let minutes = Math.floor(remainingMillis / 60000);

        let day = startDate.toLocaleDateString('de-DE');
        csvResult =  csvResult + `${index},${day},${entry.location.name},${hours}:${minutes}\n`;
      })


      // Blob object for the content to be download
      const blob = new Blob(
        [ csvResult],
        { type: 'text/csv' }
      );

      // Create a download link for the blob content
      const downloadLink = this.downloadBlob(blob, 'records.csv');

      // Set the title and classnames of the link
      downloadLink.title = 'Export Records as CSV';
      downloadLink.classList.add('btn-link', 'download-link');

      // Set the text content of the download link
      downloadLink.textContent = 'Export Records';

      // Attach the link to the DOM
      document.body.appendChild(downloadLink);

      console.log(csvResult)
      alert(csvResult)
    };
    reader.readAsText(e.target.files[0])
  }

  render = () => {

    return (<div>
      <input type="file" onChange={(e) => this.showFile(e)} />
      <input type="text" onChange={(e) => this.setState({ location: e.target.value })} />
    </div>
    )
  }
}

export default App;