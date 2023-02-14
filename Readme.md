# WUW Corpus II

Dataset created by Dr. Veton Kepuska to train Wake-Up-Word Speech Recognition. It contains audio recordings of spoken keywords.


# Formats

All files are located in `./calls/xxxxx/WUWIIxxxxx_yyy.ulaw` where each folder (5 digit number `xxxxx`) is a single recording session. Each session contains one speaker. Speakers may have multiple sessions

For each session, at most 10 utterances were recorded. The number in the file name (`yyy`) indicates the type of utterance:

```
000 Speaker name
001 Operator by itself
002 Think Engine by itself
003 Onword
004 Wildfire
005 Voyager

006 Operator in sentence
007 Think Engine in sentence
008 Onword in sentence
009 Wildfire in sentence
010 Voyager in sentence
```

## Labeling

You can find the transcription and keyword time stamp for each recording in `data.json`

> `WUWII_Transcriptions.txt` contains a manually hand created transcription and keyword time stamp.

For example, given:

```
# Date|Time|Gender|Dialect|Phonetype|File Name|Call NO|Utt. NO|Start Time|End Time|Ortho

12.21.2001|03.51.06|male|nonNative|landlinephone|00000|006|WUWII00000_006.ulaw|6.572|7.196|{breath} this is a blah blah blah and then I am invoking a uh service by saying Operator [prices paid]
```

The recording `WUWII00000_006.ulaw` contains the keyword `Operator` at time stamp 6.572-7.196 seconds.

## File checksums

`data.json` contains the filename, md5 checksum, and other metadata of each `.ulaw` file.


## Programatic file verification

The directory `./scripts` contains a nodejs v16 script `verify.js` which verifies the checksums of all files in `data.json`

```
node scripts/verify.js
```

## Generate `data.json`

`data.json` can be generated from `scripts/generate.js`.

```
node scripts/generate.js
```

# Converting to .wav

you can convert .ulaw files to .wav using ffmpeg:

```
ffmpeg.exe -f mulaw -ar 8000 -i "wuw-corpus-ii\calls\00016\WUWII00016_001.ulaw" output_file.wav
```

# Reference

Këpuska, Veton. (2011). Wake-Up-Word Speech Recognition. 10.5772/16242.

# License

Data is licensed under Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
