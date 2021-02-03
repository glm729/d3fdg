#!/usr/bin/env ruby

=begin

Script and functions for getting the BG functions for ChemInfo.
- Given a directory containing JS function definition scripts
- Get all function definitions and names
- Place all in a JS Object
- Any references to own functions prefixed with `this.`

Testing finds that this is a bit fragile:
- If the function definition source file closes the function with a semicolon,
  it will fail to insert the newline and indent
  - Implemented possible fix
- Also doesn't include the node.on("click", ... ) function for accessing data
  in the API in ChemInfo, this is unique to ChemInfo thus the function isn't
  present in the test page script

=end

# Function definitions
# -----------------------------------------------------------------------------

# Get entries in directory by extension regex
def dirExt(dir, ext = /\.js$/)
  return(Dir.entries(dir).select{|e| e.match?(ext)})
end

# Strip line and inline comments from a newline-split source file
def removeComments(text)
  # Currently hardcoded for JS comments and the two-space inline convention
  expr = {:line => /^(\s+)?[\/\*]/, :inline => /  \/.+$/}
  return(
    text.reject{|t| t.match?(expr[:line])}.map{|t| t.gsub(expr[:inline], '')}
  )
end

# Get the top / header line of a function definition file, and get function
# name and swapped form
def getTopLine(text)
  functionName = text.match(/(?<=function )([^\(]+)/)[0]
  swapped = "#{functionName}: #{text.gsub(/(?<=function) [^\(]+/, '')}"
  return({:name => functionName, :swap => swapped})
end

# Correct self-references, for within the Object
def fixSelfRef(current, refOther)
  @text = current
  # ^ Wasn't sure if this was necessary, but did it anyway because of the gsub.
  # I don't really know how to use it properly anyway, so any tips are welcome.
  refOther.each do |r|
    pattern = /(?<=[ \(])#{r}(?=\()/
    until @text.match(pattern).nil?
      @text = @text.gsub(pattern, "this.#{r}")
    end
  end
  return(@text)
end

# Operations
# -----------------------------------------------------------------------------

# Initialise function store and output string
functions = {}
output = %Q[// NOTE:
// This Object was automatically generated by an external Ruby script.
// Caution is advised if modifying the contents.
let functions = {\n  ]

# State directiry from, directory to, output file, and file extension regex
dirFrom = "./scripts"
dirTo = "./cheminfo"
outputName = "#{dirTo}/AUTO_bgFunctionDefs.js"
ext = /\.js$/

# Filenames to exclude
exclude = [
  "checkDataPresent.js",
  "openTab.js",
  "prepareVisData.js",
  "processData.js",
  "readFile.js",
  "storeKLC.js",
  "storeKRE.js",
  "storeRLI.js"
]

# Get the files by extension regex in dirFrom
inDir = dirExt(dirFrom, ext).reject{|e| exclude.any?(e)}

# Map over the target files
inDir.each do |file|
  # Read the file and strip comments
  text = removeComments(File.read("#{dirFrom}/#{file}").split(/\n/))
  # Get header line data and swap around
  topLine = getTopLine(text[0])
  text[0] = topLine[:swap]
  # Record in the functions hash
  functions[topLine[:name].to_sym] = text
end

# Get the function names array
functionNames = functions.keys.map{|k| k.to_s}

# Map over the sorted functions hash
functions.sort.to_h.each_pair do |k, v|
  # Strip ending semicolon, if present
  output.gsub(/;$/, '') if output.match?(/;$/)
  # If it ends with a function definition, append a comma, newline, and indent
  output += ",\n  " if output.match?(/\}$/)
  # Append function text with self-references fixed
  output += fixSelfRef(v.join("\n  "), functionNames)
end

# Close the object and perform cache operation
output += %Q[\n}

// Cache in the API as "bg"
API.cache("bg", functions);
console.log("Cached BG functions.");
]

# Write to the output
File.write(outputName, output, :mode => "w")