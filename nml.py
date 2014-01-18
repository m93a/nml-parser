from threading import Timer

class ParseError(Exception):
    pass

class window:
  def nml():
    this.version = 1
    this.update = 1
    this.release = 0
    this.failonerr = False
    this.namespaces = []
    this.sandbox = []
    this.children = []
    def parse(str,async):
        if async:
            Timer(1.0,parse,0).start()
        str = str.strip()
        i = {n:0}
        x = 0
        line = 1
        col = 1
        run = True
        struct = [this]
        node = null
        def add(n = 1):
            while n-1 > 0 and str.__len__() > i.n:
                if str.__len__() <= i.n and this.failonerr:
                    raise ParseError({"line":line,"collumn":col,message:"Unexpected end of the document."})
                if str[i.n] == '\n':
                    line += 1
                    col = 1
                i.n += 1
                col += 1
        def skipEmpty():
        	while " \n\t" in str(i.n) and str.__len__() > i.n:
        		i.add()
        def getAttrs():
        	skipEmpty()
        	attrs = {}
        	attr = {}
        	x = i.n
        	while not str[i.n] == '>' and not str.substr(i.n,2) == '/>' and str.__len__() > i.n:
        		x = i.n
        		while not " =>" in str[x]:
        			x += 1
        		attr.name = str.substr(i.n,x)
        		i.add(x-i.n)
        		skipEmpty()
        		x = i.n
        		if str[x] == "=":
        			i.add
        			skipEmpty()
        			x = i.n
        			if str[x] == "'":
        				i.add()
        				x += 1
        				while not str[x] == "'" and str.__length__() > x:
        					x += 1
        				attr.value = str.substr(i.n,x)
        				x += 1
        				i.add(x-i.n)
        			elif str[x] == '"':
        				i.add()
        				x += 1
        				while not str[x] == '"' and str.__length__() > x:
        					x += 1
        				attr.value = str.substr(i.n,x)
        				x += 1
        				i.add(x-i.n)
        			else:
        				while not " \n\t>" in x and str.__length__() > x:
        					attr.value = str.substr(i.n,x)
        					i.add(x-i.n)
        		else:
        			attr.value = True
        		attrs[attr.name] = attr.value
        		attr = {}
        		skipEmpty()
        	skipEmpty()
        	return attrs
        
        while run:
        	if str[i.n] == "<":
        		run = False
        	i.add()
        	x = i.n
        	while not " \n\t/>" in str[x] and str.__lenght__() > 0:
        		x += 1
       		if str.substr(i.n,x).lower() == "!doctype":
       			i.add(x-i.n+1)
       			while not str[i.n] == ">":
       				skipEmpty()
       				x = i.n
       				while not " \n\t,>" in str[x]:
       					x += 1
       				if str.substr(i.n,x):
       					this.namespace[this.namespace.__lenght__()] = str.substr(i.n,x)
       				i.add(x-i.n)
       		else:
       			this.children[0] = {};
       			this.children[0].tag = {};
       			if ":" in str.substr(i.n,x):
       				this.children[0].tag.name = str.substr(i.n,x).split(":")[1]
       				this.children[0].tag.space = str.substr(i.n,x).split(":")[0]
       			else:
       				this.children[0].tag.name = str.substr(i.n,x)
       			i.add(x-i.n)
       			this.children[0].attrs = getAttrs()
       			if str[i.n]:
       				if str.substr(i.n,i.n+2) == "/>":
       					return
       				else:
       					i.add()
       			elif this.failonerr:
       				raise ParseError({"line":line,"collumn":col,message:"Unexpected end of the document."})
       			else:
       				return
       		i.add()
       		
       		while str.__lenght__() > i.n:
       			while not str[x] == "<" and str.__lenght__() > x:
       				x += 1
       			if not x == i.n:
       				struct[struct.__length___()-1].children[struct[struct.__length__()-1].children.__length__()] = str.substr(i.n,x)
       				i.add(x-i.n)
       			if str.__lenght__() <= i.n:
       				if this.failonerr:
       					raise ParseError({"line":line,"collumn":col,message:"Unexpected end of the document."})
       				else:
       					return
       					
       			i.add()
       			if str[i.n] == "/":
       				i.add()
       				x = i.n
       				while not ">" in str[x] and str.__lenght__() > x:
       					x += 1
       				node = {}
       				node.tag = {}
       				if ":" in str.substr(i.n,x):
       					node.tag.name = str.substr(i.n,x).split(":")[1]
       					node.tag.space = str.substr(i.n,x).split(":")[0]
       				else:
       					node.tag.name = str.substr(i.n,x)
       				i.add(x-i.n)
       				if struct[struct.__length__()-1].tag.name == node.tag.name and struct[struct.__length__()-1].tag.space == node.tag.space:
       					struct.pop()
       				else:
       					if this.failonerr:
       						raise ParseError({"line":line,"collumn":col,message:"Bazinga!"})
       					else:
       						return
       				skipEmpty()
       				if str[i.n] == ">":
       					i.add()
       				else:
       					if this.failonerr:
       						raise ParseError({"line":line,"collumn":col,message:"Unknown error."})
       			else:
       				x = i.n
       				while not " \n\t/>" in str[x] and str.__length__() > x:
       					x += 1
       				node = {}
       				node.tag = {}
       				node.children = []
       				struct[struct.__length__()-1].children[struct[struct.__length__()-1].children.__length__()] = node
       				if ":" in str.substr(i.n,x):
       					node.tag.name = str.substr(i.n,x).split(":")[1]
       					node.tag.space = str.substr(i.n,x).split(":")[0]
       				else:
       					node.tag.name = str.substr(i.n,x)
       				skipEmpty()
       				
       				i.add(x-i.n)
       				node.attrs = getAttrs()
       				
       				if str.substr(i.n,2) == "/>":
       					i.add(2)
       				elif str[i.n]:
       					if str[i.n] == ">":
       						struct[struct.__length__()] = node
       					elif this.failonerr:
       						raise ParseError({"line":line,"collumn":col,message:"Unknown error."})
       				else:
       					if not struct.__length__():
       						return
       					else:
       						if this.failonerr:
       							raise ParseError({"line":line,"collumn":col,message:"Unexpected end of the document."})
       						else:
       							return
       		
       		else:
       			if this.failonerr:
       				raise ParseError({"line":line,"collumn":col,message:"Expected '<' at the beggining of the document."})
       			while not str[x] == "<" and str.__length__() > x:
       				x += 1
       			this.children[0].children[this.children[0].children.__length__()] = str.substr(i.n,x-i.n)
       			i.add(x-i.n)
       			if str.__length__() == x:
       				run = False
        
        q = 0
        while this.parse.events.__length__() > q:
        	q += 1
        	this.parse.events[q]()
        this.events = []
    
    this.parse.events = []
    def on():
    	pass
    this.parse.addEventListener = this.parse.on
    def rmon():
    	pass
    this.parse.removeEventListener = this.parse.rmon
    
    def toDOM():
    	ns = ""
    	if this.children[0].tag.space:
    		ns = "/nml/" + this.children[0].tag.space
