# Hi Mumsnet!

This is my technical test, built using:
- Handlebars (for templating the markup and taking in JSON data)
- SASS (for compiling the styles into CSS)
- jQuery (for triggering the datepicker included in jQuery UI)
- Gulp (for running the tasks to compile and minify all the source files)

To install it, run the following commands:
1. `npm install` - to download and install all the node modules needed for Gulp
2. `gulp` - to run all the tasks that will create the dist folder

## Folder Structure

### Data
This folder contains the JSON file with all the text and field information needed to create the page.

### Handlebars
This folder contains the Handlebars templates for the Registration page and the separate sections imported into the
Registration page (e.g. the header, the cards, the footer etc). It also contains a helpers file which allows us to 
create Handlebars Helpers functions that can be used in our templates (only currently used for a more powerful if loop 
and a slug generator).

### Images
This folder contains all the image files used on this project.

### JS
This folder contains the JS files needed to adding the datepicker functionality to the 'Your pregnancy' field.

### SASS
This folder contains all the SASS files needed for compiling into the CSS files used on the website. It's separated into
3rd party styles (Bootstrap and jQuery UI) and the styles written by me to get the page looking like the design. 

## Next Steps
- Adding validation/error and complete states
- Adding ability to add another child when inputting in dates
- Adding the background image (wasn't included on Zeplin in the web version!)
- Collecting all the form data on submission and forming an object variable for posting to the backend