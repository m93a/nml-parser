
//TODO add comment support


//NMLElement
window.NMLElement = function(doc,name,space){
 if(!this instanceof NMLElement){
  return new NMLElement(doc,name,space);
 };
 this.tag = {name:name,space:space};
 this.children = [];
 this.ownerDocument = doc;
 this.parent = null;
 this.nthChild = null;
 
 
 this.getNamespace = function(){
  return doc.namespaces[this.tag.space] || '/nml';
 };
 
 this.appendChild = function(node){
  if(!node instanceof NMLElement){
   throw Error("Argument 1 does not implement NMLElement");
  }
  node.parent = this;
  node.nthChild = this.children.length;
  this.children.push(node);
  doc.trigObserver('add',{
   target: node,
   parent: this
  });
 };
 
 this.remove = function(){
  doc.trigObserver('rm',{
   target: this,
   parent: this.parent
  });
  this.parent.children[this.nthChild] = null;
  this.parent = null;
 };
};


//NMLDocument
window.NMLDocument = function(){
 this.failonerr = false;
 this.namespaces = {
  'html': "http://www.w3.org/1999/xhtml"
 };
 this.sandbox = [];
 this.children = [];
 
 this.createElement = function(name,space){
  return new NMLElement(this,name,space);
 };
 this.appendChild = function(node){
  if(!node instanceof NMLElement){
   throw Error("Argument 1 does not implement Node");
  }
  node.parent = this;
  node.nthChild = this.children.length;
  this.children.push(node);
  this.trigObserver('add',{
   target: node,
   parent: this
  });
 };
 
 this.observe = function(what,listener){
  if(!what in this.observers){throw Error('No such event');}
  this.observers[what].push(listener);
 };
 this.unobserve = function(what,listener){
  if(!what in this.observers){throw Error('No such event');}
  var arr = this.observers[what];
  var i = arr.indexOf(listener);
  ( i > -1 )&&( arr.slice(i,i+1) );
 };
 this.trigObserver = function(what,props){
  if(!what in this.observers){throw Error('No such event');}
  var self = this;
  setTimeout(function(){
   var arr = self.observers[what];
   var i=-1, l=arr.length;
   while(++i<l){
    arr[i](props);
   }
  },0);
 };
 this.observers = {
  'add':[],
  'rm':[],
  'attr':[]
 };
 
 
 this.parse = function(str,async){
  if(async){
   setTimeout(this.parse,0);
   return;
  }
  //Preparation
  str = str.trim();
  var i = {n:0};//The major cursor
  var x = 0;    //The minor cursor
  var line = 1;
  var col  = 1;
  var run = true;
  var structure = [this];
  var node;
  i.add = function(n){//i++ with line counter
   if(!n){n=1;}
   while(n-->0&&str.length>i.n){
    if(str.length<=i.n&&this.failonerr){throw {line:line,collumn:col,message:"Unexpected end of the document."};}
    if(str[i.n]=="\n"){line++;col=1;}
    i.n++;col++;
   }
  }
  var skipEmpty = function(){//Skip to the first non-empty character
   while(" \n\t".indexOf(str[i.n])+1&&str.length>i.n) {i.add();}
  };
  var getAttrs = function(){//Parse tag's attributes
   skipEmpty();
   var attrs = {};
   var attr = {};//Buffer
   var x = i.n;  //Redefine the minor cursor
   while(str[i.n]!=">"&&str.substr(i.n,2)!="/>"&&str.length>i.n){//Until the end of the tag
    x=i.n;
    while(!(" =>".indexOf(str[x])+1)){x++;}
    attr.name=str.substring(i.n,x);//Save attribute name
    i.add(x-i.n);
    skipEmpty();
    x=i.n;
    if(str[x]=="="){
     //String attribute
     i.add();
     skipEmpty();
     x=i.n;
     if(str[x]=="'"){
      //For single quotes
      i.add();x++;//Skip the quote
      while(str[x]!="'"&&str.length>x){x++;}
      attr.value=str.substring(i.n,x);//Save attribute value
      x++;//Skip the quoto
      i.add(x-i.n);//Move i to x
     }else if(str[x]=='"'){
      //For double quotes
      i.add();x++;//Skip the quote
      while(str[x]!='"'&&str.length>x){x++;}
      attr.value=str.substring(i.n,x);//Save attribute value
      x++;//Skip the quote
      i.add(x-i.n);//Move i to x
     }else{
      //For value without quotes
      while(!(" \n\t>".indexOf(str[x])+1)&&str.length>x){x++;}
      attr.value=str.substring(i.n,x);//Save attribute value
      i.add(x-i.n);//Move i to x
     }
    }else{
     //Boolean attribute
     attr.value=true;//Save attribute value
    }
    attrs[attr.name]=attr.value;//Write to the array
    attr = {};//Clean buffer
    skipEmpty();
   }
   skipEmpty();
   return attrs;
  };
  
  //Parsing
  while(run){
   if(str[i.n]=="<"){
    //If the document begins with "<"
    run = false; //Do not repeat the cycle
    i.add();
    x = i.n;
    while(!(" \n\t/>".indexOf(str[x])+1)&&str.length>x) {x++;}
    if(str.substring(i.n,x).toLowerCase()=="!doctype"){
     //If the first tag is doctype
     i.add(x-i.n+1);
     while(str[i.n]!=">"){
      //Get the namespaces
      skipEmpty();
      x=i.n;
      while(!(" \n\t,>".indexOf(str[x])+1)){x++;}
      if(
       str.substring(i.n,x) &&
       !this.namespaces[str.substring(i.n,x)]
      ){
       this.namespaces[str.substring(i.n,x)]='/nml/'+str.substring(i.n,x);
      }
      i.add(x-i.n);//Move i to x
     }
    }else{
     
     i.add();
     if(str.substring(i.n,x).indexOf(":")+1){//With namespace
      node = this.createElement(
       str.substring(i.n,x).split(":")[0],
       str.substring(i.n,x).split(":")[1]
      );
     }else{//Without namespace
      node = this.createElement(str.substring(i.n,x));
     }
     this.appendChild(node);
     
     i.add(x-i.n);//Move i to x
     this.children[0].attrs = getAttrs();
     if(str[i.n]){
      if(str.substring(i.n,i.n+2)=="/>"){
       return;
      }else{
       i.add();
      }
     }else if(this.failonerr){
      throw {line:line,collumn:col,message:"Unexpected end of the document."};
     }else{
      return;
     }
    }
    i.add();
    
    //BEGIN Main cycle
    
    while(str.length>i.n){
     //Add text node
     while(str[x]!="<"&&str.length>x){x++;}
     if(x!=i.n){
      structure.lenght-1 &&         //if active node != document
      structure[structure.length-1]
       .children.push(
        str.substring(i.n,x)
       );
      
      this.trigObserver('add',{
       target: str.substring(i.n,x),
       parent: structure[structure.length-1]
      });
      
      i.add(x-i.n);
     }
     if(str.length<=i.n){
      if(this.failonerr){
       throw {line:line,collumn:col,message:"Unexpected end of the document, document does not end with the ending tag of the root."};
      }else{
       return;
      }
     }
     
     //Parse tag
     i.add();
     if(str[i.n]=="/"){//Ending tag
      i.add();
      x = i.n;
      while((!(">".indexOf(str[x])+1))&&str.length>x) {x++;}
      
      node = {};
      node.tag = {};
      if(str.substring(i.n,x).indexOf(":")+1){//With namespace
       node.tag.name  = str.substring(i.n,x).split(":")[1];
       node.tag.space = str.substring(i.n,x).split(":")[0];
      }else{//Without namespace
       node.tag.name  = str.substring(i.n,x);
      }
      i.add(x-i.n);
      if(
       structure[structure.length-1].tag.name  == node.tag.name &&
       structure[structure.length-1].tag.space == node.tag.space
      ){
       structure.length--;
      }else{
       //begin TODO
       if(this.failonerr){
        throw {line:line,collumn:col,message:"Bazinga!"};
       }else{
        return;
       }
       //end TODO
      }
      skipEmpty();
      if(str[i.n]==">"){
       i.add();
      }else{
       if(this.failonerr){
        throw {line:line,collumn:col,message:"Unknown error"};
       }
      }
     }else{
      x = i.n;
      while((!(" \n\t/>".indexOf(str[x])+1))&&str.length>x) {x++;}
      
      if(str.substring(i.n,x).indexOf(":")+1){//With namespace
       node = this.createElement(
        str.substring(i.n,x).split(":")[1],
        str.substring(i.n,x).split(":")[0]
       );
      }else{//Without namespace
       node = this.createElement(str.substring(i.n,x));
      }
      structure[structure.length-1].children[structure[structure.length-1].children.length] = node;
      skipEmpty();
      
      //Parse attributes
      i.add(x-i.n);//Move i to x
      node.attrs = getAttrs();
      
      structure[structure.length-1].appendChild(node);
      
      //End the tag
      if(str.substr(i.n,2)=="/>"){
       i.add(2);
      }else if(str[i.n]){
       if(str[i.n]==">"){
        structure.push(node);
        i.add();
       }else if(this.failonerr){
        throw {line:line,collumn:col,message:"Unknown error"};
       }
      }else{
       if(!structure.length){
        return;
       }else{
        if(this.failonerr){
         throw {line:line,collumn:col,message:"Unexpected end of the document"};
        }else{
         return;
        }
       }
      }
     }
     
    }
    
    //END Main cycle
    
   }else{ 
    //If the document begins with an invalid character
    if(this.failonerr){
     throw {line:line,collumn:col,message:"Expected '<' at the beginning of the document."};
    }
    while(str[x]!="<"&&str.length>x){x++;}//Get the position of a)the "<" char or b)the end of the document
    this.children[0].children[this.children[0].children.length] = str.substring(i.n,x-i.n);//Insert the text into root element
    i.add(x-i.n);//Move i to x
    if(str.length==x){
     run = false; //If x is the end of the document, do not repeat the cycle
    }
   }
  }
  
  var q = 0;
  while(this.parse.events.length>q){
   this.parse.events[q++]();
  }
  this.events = [];
 };
 this.parse.events = [];
 this.parse.on = function(){
  //TODO
 };
 this.parse.addEventListener = this.parse.on;
 this.parse.rmon = function(){
  //TODO
 };
 this.parse.removeEventListener = this.parse.rmon;
 
 this.toDOM = function(doc){
  var ns = "/nml/"+this.children[0].getNamespace();
  
  var doc = (new Document()).implementation.createDocument(
   ns, //Namespace identifier
   this.children[0].tag.name, //Set root element's tag name
   
   (new Document()).implementation.createDocumentType(
    this.namespaces[0], //Add a simple doctype
    "", //No DTD, the same way as in HTML5
    ""
   )
  );
  
  //BEGIN Main cycle
  var f = function(f,e,d,x){
   var node;
   if(typeof e == "string"){
    node = d.createTextNode(e);
    x.appendChild(node);
   }else{
    if(e.tag.space){
     if(e.tag.space = 'html'){
      node = d.createElementNS(this.htmlns,e.tag.name);
     }else{
      node = d.createElementNS("/nml/"+e.tag.space,e.tag.name);
     }
    }else{
     node = d.createElementNS('/nml',e.tag.name);
    }
    var i = 0;
    for(attr in e.attrs){
     node.setAttribute(attr,e.attrs[attr]);
    }
    x.appendChild(node);
    var i = 0;
    while(e.children.length>i){
     f(f,e.children[i],d,node);
     i++;
    }
   }
  }
  
  var i = 0;
  while(this.children[0].children.length>i){
   f(f,this.children[0].children[i],doc,doc.lastChild);
   i++;
  }
  //END Main cycle
  
  
  return doc;
 };
 this.toDOM.events = [];
 this.toDOM.on = function(){
  //TODO
 };
 this.toDOM.addEventListener = this.toDOM.on;
 this.toDOM.rmon = function(){
  //TODO
 };
 this.toDOM.removeEventListener = this.toDOM.rmon;
};
