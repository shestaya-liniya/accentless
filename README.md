## Intro
One day I was thinking about how much I hate my accent when speaking english, and I've got a thought, what if I could use the AI to help me shape it.
The idea seemed to be very attractive and wasn't about being that awkward "AI tutor" - a soulness mannequin with uncanny valley effect, asking: "How was your day?".  

After the idea I was jumping into research of similar projects, and fortunately have found a ready-to-test gh open source repo:  
https://github.com/Thiagohgl/ai-pronunciation-trainer.  

An acoustic researcher/sciencist - [Thiago Lobato](https://www.linkedin.com/in/thiagohgl/), has built an awesome app, but with poor UI/UX, and in my head I have visualized a more beautiful
interface which I have started to develop directly.
The original repo had server side logic written on python, using AI which runs locally - absolutely cool. But looking on my nullish skills
on python and fast warming macbook air, I've decided to use beloved typescript for backend and
[MS Azure Speech Pronunciation Assessment API](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/how-to-pronunciation-assessment?pivots=programming-language-javascript),
which allowed me to fully focus on the UI. 

In the end, I wasn’t fully satisfied with the accuracy of the MS Azure Speech API, but I managed to bring my UI vision to life — and I’m pretty happy about that.

[![Open](https://raw.githubusercontent.com/shestaya-liniya/icons/main/button-open.svg)](https://accentless-client.pages.dev/)

## About
A language learning tool which record you reading sentences, analyze the pronunciation with AI and gives a detailed review.
