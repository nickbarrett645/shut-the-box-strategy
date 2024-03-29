# shut-the-box-strategy

## How to run the simulation
```bash
npm run simulation
```

## How to run the analysis
```bash
npm run analysis
```

## Basic Data Analysis with jq
If you don't have [jq](https://jqlang.github.io/jq/) install it

Pipe it all to jq
```bash
cat data/test.json | jq
```

See how many games were played
```bash
cat data/test.json | jq '.[] | length'
```

Get a particular game
```bash
cat data/test.json | jq '.[0]'
```

See how many rounds the game had
```bash
cat data/test.json | jq '.[0].rounds | length'
```

Get a particular round
```bash
cat data/test.json | jq '.[0].rounds.[0]'
```

See how many rolls a round had
```bash
cat data/test.json | jq '.[0].rounds.[0].rolls | length'
```

Sum up the roll values for a round
```bash
cat data/test.json | jq 'reduce .[0].rounds.[0].rolls[] as $x (0; . + $x.rollValue)'
```



# TODO
- Define strategies
- Enable strategy use
- Capture metrics on results
- Add way to play a single game
- Add way to play a game vs the computer

