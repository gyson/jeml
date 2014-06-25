# JEML
Javascript-embedded Markup Language 

## Installation

```
$ npm install jeml
```

## example
in `layout.jeml`:
    
    default (title, body) {
        html: {
            head: {
                title: `title`
            }
            body: {
                `body`
            }
        }
    }
    
in `view.jeml`:

    import layout "./layout" // import default mixin from layout.jeml
    
    default {
        `layout("I am title", body())`
    }
    
    mixin body {
        p: "I am body"
    }
