* A User can create a sequence of notes and loop them
* The browser will visually show which point in the loop it is at
* A User can change the tempo of the song
* The browser will give a visual indication of the tempo
* A User can create more than one pattern of notes and switch between them
* A User can change the oscillators used for their loops
* A User can add effects to their loops

* A User can have more than one loop play at a time
* A User can create drum loops

* A User can save their Settings and Patterns and recall them
* A user can update their settings and patterns
* A User can delete a group of settings and patterns

* A User can record a performance
* A User can upload their recording to Soundcloud


***********************
* A user has many songs
* Songs contain settings and patterns (array of arrays)
***********************

MAKE PATTERNS THEIR OWN MODEL
MAKE PATTERNS SWAPPABLE W OTHER USERS

* USER:
  f_name: string
  l_name: string
  email: string
  password: string
  songs: reference

* SONGS:
  title: string
  settings: array of data
  patterns: array of arrays
  sent_to_soundcloud?: boolean
