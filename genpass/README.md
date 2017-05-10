# Genpass

Generates passphrases by key extension.

## Why?

It's a good security practice to have a different password for every account. This makes it easy. It's like a password
manager, but there's no database. It's impossible to lose your data or have evil hackers on steroids steal your
passwords because there's nothing to lose or have stolen.

## How?

It takes *two* pieces of information: a "salt" that anyone can see (e.g.: `youtube`) and a "secret" that you keep to
yourself (e.g.: `hunter2`). It scrambles them up with [`PBKDF2-SHA256`][1] and gives you your password (e.g.:
`EPuPBQL1iOTLTcGb`) to copy and paste.

Some websites still have weird password rules (e.g.: "must contain at least 4 numbers", "must not be divisible by any
11-digit prime", "must contain at least one Emojii 😀, two Mahjong tiles 🀗🀣, and a chess piece ♖"). There are toggle
switches for those in the menu. (It only uses letters and numbers by default.)

### Is this safe?

None of this information is in any way transmitted to any third party, including myself. All the code runs entirely in
the browser. There are no ads, no analytics, no tracking, no cookies. Nothing. What you type into the inputs doesn't
even go to GitHub.

> TODO: Allow user the option to store their salts in their browser session. Must be off by default.

It's as safe as remembering all your passwords yourself.

## Where?

Here: [Genpass](https://tron1point0.github.io/genpass/index.html)




[1]: https://en.wikipedia.org/wiki/PBKDF2
