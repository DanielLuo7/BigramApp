# Bigram App

# Problem Statement
Built an app that can take an arbitrary block of text and display a histogram of the bigrams in that text

# App Description

Users enter an arbitrary block of text into an input field within the web app along with some other feature parameters. Users then can generate a histogram representing the frequencies of ngrams from their block of text.

## Ngrams Feature
Rather than only supporting bigrams, users can now request ngrams for their block of text. The block of text is sent to the backend, normalized into an array of only words consisting of lowercase letters, and then processed into an frequency counter. Right now, the app does not support punctuation and treats all letters in their lowercase form. 

## K Most Frequent Ngrams
Users can request to only see the K most frequent ngrams from their input. Users can still request to see all ngrams, but this feature allows for some flexibility in only querying the K most frequent ngrams. Users are still able to request all ngrams from their input


## Histogram Scroll Bar
A UI/UX feature that makes the histogram more readable. Before, the histogram was compressed and unreadable if the number of ngrams exceeded a certain threshold. Now, users can scroll through the histogram for a much better experience
