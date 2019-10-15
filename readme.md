# Cache Buster

when you change the css file in the ./src folder, it is copied to the ./dist folder and a hash is appended to the file name. Then the html files are updated with the updated css file links.

```javascript

// install all the dependencies needed
yarn install

// run the default process
gulp

// watch all css and html files in the ./src folder for any changes
gulp watch


// appends a querystring  myimage.jpg?dskjflasdj to the files
// this works on all links in the html file
gulp queryString

// changes the file name of the files
gulp fileName

// cleans the output folder ./dist of all content
gulp clean

```
