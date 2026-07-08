# Adding a Language:
- Follow the "Letter Codes" instruction below. In this example, we will use the english code EN, but you should use the one for your language.
- Create a folder with the name of the language you are adding
- In the exports.js file, copy the EN-exports line, replacing EN with the correct letters.
- In your language folder, create a file called EN-exports.js
- Now, copy an english language i18n file over, and change the EN to the right letters
- Lastly, add `import * from file-name` to your EN-exports.js file, changing file-name to the name of the file you made

# Letter codes:
https://www.loc.gov/standards/iso639-2/php/code_list.php<br>
Use ISO 639-1 where possible<br>
ISO 639-2 otherwise<br>
Else use whatever is reasonable and **NOT** already on that list<br>
If you are using a regional dialect (i.e. Brazilian Portuguese vs Portuguese Portuguese) use the Alpha-3 code of the language, followed by a -, then the language code<br>
https://www.iban.com/country-codes

Extra Info:

\$?aX (where ? is a number, starts at 1 goes up for each occurance) is placeholder and is replaced<br>
\$, without ?aX after it, is used to split strings into multiple without using tons of string unnecessarily<br>
If you need to split a string into multiple lines, make sure it uses backticks (\`)<br>
If you are in backticks, and need to go to a new line, but dont want to split the string, place a \ just before the line break