# Wolcen Localization

This is a tiny nodejs script to work with Wolcen localization files.
It is been done against nodejs v12.16.1 but could work with previous versions...

### Installation

- Clone the repo 
- Copy/paste the *.env.example* file as a *.env* file and fill it with the Wolcen installation folder
- Install nodejs dependencies by running the following command : `npm install`

### Usage

Three commands are available :

- `npm run unpack` to unpack the default localization file to the *xml* folder
- `npm run extract` to extract all localized texts into the *txt* folder
- `npm run pack` to produce the pak file from xml
