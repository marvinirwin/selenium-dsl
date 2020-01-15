MAIN -> SENTENCE "."
DEFINITION -> NOUN _ "is" _ NOUN {%  %}
SENTENCE -> (VERB _ ARTICLE _ NOUN) | (DEFINITION)
VERB -> "Click" | "Type" | "Wait"
ARTICLE -> "any" | "the"
selectorCharacter -> ([0-9a-zA-Z]) | ">" | " " | "." | "#" | "(" | ")" | ":" | "_" | "-"
_ -> " "
NOUN -> selectorCharacter:+ {% (d) => d.join('') %}

