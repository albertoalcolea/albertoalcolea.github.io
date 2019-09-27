---
title:  "Securizing Spotify Snap"
date:   2019-09-27 19:45:00 +0200
---
For some years now we can enjoy a fully functional [Spotify Linux client](https://www.spotify.com/us/download/linux/) without having the need to use a concrete distribution, third-party applications or hacks to get to use this music streaming service, whether we are premium users or not.

And Spotify did it right. They decided to distribute the Linux client throught [Snap](https://snapcraft.io/), the package management system developed by Canonical to create distribution-agnostic self-contained packages. So today we can use Spotify regardless of the distribution of Linux we use, great, right?

Snap containers rely on AppArmor to securize them in jails to control how the containarized applications can interact with the host system. And AppArmor is a [Linux kernel security module](https://en.wikipedia.org/wiki/Linux_Security_Modules) that allow the user to restrict programs' capabilities such as network access, socket access or file permissions with per-program profiles. AppArmor supplements the traditional [Unix access control model](https://en.wikipedia.org/wiki/Discretionary_access_control) by providing [mandatory access control](https://en.wikipedia.org/wiki/Mandatory_access_control) (MAC), i.e. you can restrict network access to one binary while for another you can grant read privileges to only one controlled directory.

When you install an application throught Snap, it creates a new AppArmor profile for it. Those profiles are created by the developers and maintainers of the applications, so it’s not a bad idea to check them out just to make sure they do more than they should.  

If we take a look to the AppArmor profile for Spotify we will notice that there are hundred of rules, but around the line `1328` we will notice something suspicius.

The profile is usually in this path:

```shell
/var/lib/snapd/apparmor/profiles/snap.spotify.spotify
```

And this is the content of the lines `1327` and `1328`:

```shell
# Allow read access to toplevel $HOME for the user
owner @{HOME}/ r,
```

That rule gives Spotify privileges to **read all your home directory**. I mean your `$HOME` for your own user **recursively with all subdirectories and files stored in it**.

I guess that the purpose to include that privile is to support the Spotify's feature to [add your local audio files](https://support.spotify.com/us/using_spotify/features/listen-to-local-files/) in your playlists, but this gives it privileges too high for what we might expect from a streaming music player, especially considering that it is a non-open source application and we don't know what it really does. Personally, I've never used it and I don't need it. I have a big collection of ripped CD in flac and I'm fine using another music player to play them, meanwhile I use Spotify just for music streaming.

If we don't want Spotify to read any file from our `$HOME` directory, we can just comment that line:

```shell
# Allow read access to toplevel $HOME for the user
#owner @{HOME}/ r,
```

And parse the profile again executing:

```shell
sudo apparmor_parser -r /var/lib/snapd/apparmor/profiles/snap.spotify.spotify
```

Now, if we try to add a new local music source, Spotify will throw a `Permission Denied` error. We did it!
