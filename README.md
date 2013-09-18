nml
==

Namespace Markup Language parser

##How to set up
To parse a document, you have to create new `nml` object.
```js
var doc = new nml();
```
Then, you can change to `failonerr` mode, that stops the parser if an error occures.
```js
doc.failonerr = true;
```
And finally you should set up _sandbox_ elements - that ones, which may contain only __one text child__ (such as _html:script_ element in html6) **TODO**
```js
doc.sandbox = [
 {name:"script",space:"html"},
 {name:"textarea",space:"form"},
 {name:"customelementsrock"}
];
```
Now you are ready to parse.

##How to parse
Before the parsing, you have to load your document (via http or from a local file) into a local variable (as a string), then you can call the `parse` function.
```js
var str = "<svg:svg width=100 height=100><g><svg:path d=\"M0,0 L100,100\" /></g></svg:svg>";
doc.parse(str);
console.log(doc.childs[0]);
```
You can also call the parser asynchronously. **TODO**
```js
doc.parse.on("error",function(e){
 console.log(e.line);
 console.log(e.collumn);
 console.log(e.message);
});
doc.parse.on("success",function(e){
 console.log(doc.[0]);
});
doc.parse(str,true);
```
After parsing you will maybe need to export a DOM document. That can be easily done using the `toDOM` function. **TODO**
```js
doc.parse(str);
node = doc.toDOM().body;
document.importNode(node,true);
```
