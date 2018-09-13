### To start

```sh
npm install
npm start
```

then visit `http://localhost:8080`

### Walkthrough

[The walkthrough](https://image.ibb.co/c4oezp/canpango_beer_walkthrough.gif)
is just what the features look like on my machine

### Features included

- responsive
- displays categories
- choose categories to display beers
- choose beer to display details
- search for beer
- add/delete new category
- add/delete new beer
- edit beer

### What's missing

- edit category name
- data validation (user is not notified of incorrect data submissions)
- no confirmation of delete
- adding a category when data is **not** editable makes it seem like no category
  was added. If this were a real application then this issue wouldn't occur
  because the UX would either be geared toward viewing/searching data or
  modifying it, not both.
- various user feedback in UX e.g. no loading symbol when a beer is being added.
  This is just due to time constraints.
- url routing (would be nice if /beer/id showed the beer details view)
- "The add beer form should show categories as a drop down populated by the API"
  - Instead of having a separate "add beer" button, I placed those buttons
    underneath each category. This made more sense to me from a UX
    perspective, but I'm not married to the idea.
