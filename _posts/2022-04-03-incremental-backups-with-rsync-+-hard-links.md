---
title:   Incremental backups with rsync + hard links
date:    2022-04-03 10:30 +0200
image:   /assets/img/posts/2022-04-03-backups/backup-strategy.jpg
excerpt: The combo rsync + hard links allows you to create on-site and off-site incremental backups on Linux, minimizing disk occupancy and allowing fast file recovery in case of disaster, that you can automate easily with a little sugar over those commands.
---

> No one cares about backups until they lose something.

That was exactly what happened to me at the end of 2020 and after that unfortunate incident I decided to start taking backups seriously.

Until then, my "strategy" to keep my data safe was to make a manual copy on an external drive every so often when, by chance, I remembered I had to do it.

But after that misfortune I made up my mind that it would never happen to me again and I started to investigate thoughtfully different strategies and tools to make reliable backups.

During this journey I discovered one of the most accepted methods to achieve it, the 3-2-1 backup strategy, which states that:

- You should have, at least, 3 copies of your data.
- In 2 different storage media.
- 1 must be at an off-site location.

And while looking for tools with which to apply this on my personal devices I discovered this fantastic combo: **rsync + hard links**.

## Hard links

Every file on a Linux system is stored as an inode. An inode is an entry in a table that describes the file metadata such as file size, permissions, timestamps, etc., and the physical location of the content in the hard drive.

When you move a file and the destination is on the same filesystem, the file content is not physically moved inside the hard drive, but the file, the pointer to the inode, is deleted and a new one is created in a different place pointing to the same inode.

This concept is especially important for understanding what a hard link is. A hard link is just a filename in a specific path of a directory structure that points to an inode, it is a _link_ between the filename and the metadata stored in the inode table.

You can create more than one file (more than one hard link) pointing to the same inode with the command `ln`:

```bash
$ echo 'test' > file1
$ ls -i
1968233 file1
$ ln file1 file2
$ ls -i
1968233 file1  1968233 file2
```

_Note: the `-i` param. of `ls` shows the inode number, the identifier of the inode entry in the inode table._

You can move the original file (`file1`) and any other file pointing to the same inode will not be affected. On the other hand, any modification (content, permissions, ownership, timestamps...) made to one of the files will be reflected in the others, as they all point to the same inode.

```bash
$ mv file1 test/original
$ ls -i test/original
1968233 test/original
$ ls -i file2
1968233 file2
$ echo 'hello world' >> file2
$ cat test/original
test
hello world
```

Moreover, if the original file is deleted, the data still exists under the other hard links. The data is only removed from the disk when all links to the inode have been removed.

For completeness, a symbolic link is not a standard file, but a special file that points to an existing file, that can be in the same filesystem or not. If the original file is deleted, the soft link is broken.

Note the difference, a hard link is a file that points to an inode entry, and a symbolic link is a file that points to another file.

![Hard links and soft links](/assets/img/posts/2022-04-03-backups/hard-soft-links.jpg "Difference between hard links and soft links")

### Manual incremental backups with hard links

We can take advantage of the fact that **multiple hard links can point to the same inode to make disk-efficiency incremental backups**.

Doing incremental backups consists of periodically taking snapshots of a directory we want to backup and only copying the files that have been altered somehow since the last snapshot.

Imagine you have a directory (`original`) which contains 3 files. You do the first incremental backup, which will be a full backup since there is no previous backup, copying those 3 files to the destination directory (`backup1`).

Some time later you start working on the `original` directory again creating a new file and you decide it is a good idea to make a new backup to make sure you don't lose your changes. You take a new snapshot and you see that 3 of the 4 files have not been modified since the last backup, so you only copy the new file to the new destination directory (`backup2`) as the other 3 are already present in the previous backup (`backup1`).

At the end you have 3 files of the first snapshot in the first backup directory (`backup1`) and 1 file of the second snapshot in the second backup directory (`backup2`).

This is how incremental backups work theoretically, but we can do something more intelligent and practical using hard links.

Instead of discarding all the repeated files we can create hard links pointing to their same inodes. This way we can keep the complete directory structure of the source directory in each backup without increasing the disk usage, since we are not storing the contents of the file on disk more than once.

```bash
mkdir original backup1 backup2
touch original/f1 original/f2 original/f3

# First snapshot (backup1)
for f in $(ls original); do
	cp "original/$f" "backup1/$f"
done

# We change the state of the original directory
touch original/f4

# Second snapshot (backup2)
for f in $(ls original); do
	if [ -f "backup1/$f" ]; then
		ln "backup1/$f" "backup2/$f"
	else
		cp "original/$f" "backup2/$f"
	fi
done

# Results
$ ls -li original/
total 0
1970965 -rw-r--r-- 1 alberto alberto 0 mar 31 23:22 f1
1971053 -rw-r--r-- 1 alberto alberto 0 mar 31 23:22 f2
1971070 -rw-r--r-- 1 alberto alberto 0 mar 31 23:22 f3
1971074 -rw-r--r-- 1 alberto alberto 0 mar 31 23:22 f4
$ ls -li backup1/
total 0
1970965 -rw-r--r-- 2 alberto alberto 0 mar 31 23:22 f1
1971053 -rw-r--r-- 2 alberto alberto 0 mar 31 23:22 f2
1971070 -rw-r--r-- 2 alberto alberto 0 mar 31 23:22 f3
$ ls -li backup2/
total 0
1970965 -rw-r--r-- 2 alberto alberto 0 mar 31 23:22 f1
1971053 -rw-r--r-- 2 alberto alberto 0 mar 31 23:22 f2
1971070 -rw-r--r-- 2 alberto alberto 0 mar 31 23:22 f3
1971074 -rw-r--r-- 1 alberto alberto 0 mar 31 23:22 f4

```

_Note: of course in a real environment we should check something else than the filename, but this makes the example easier._

If after some time we decide to delete the oldest backups to free up some space, the other backups remain unchanged since they still contain hard links pointing to the same inode entries than the deleted files.

```bash
$ rm -r backup1
$ ls -li backup2/
total 0
1970965 -rw-r--r-- 1 alberto alberto 0 mar 31 23:22 f1
1971053 -rw-r--r-- 1 alberto alberto 0 mar 31 23:22 f2
1971070 -rw-r--r-- 1 alberto alberto 0 mar 31 23:22 f3
1971074 -rw-r--r-- 1 alberto alberto 0 mar 31 23:22 f4
```

Moreover, hard links are supported by any POSIX-compliant filesystem: ext4, XFS, Btrfs, ZFS, etc. And even [Microsoft's NTFS is POSIX-compatible](https://social.technet.microsoft.com/wiki/contents/articles/10224.posix-and-unix-support-in-windows.aspx) in the sense it allows the creation of hard links (and other functionalities).

## rsync

`rsync` is a very powerful tool for synchronizing files.

I had used it in the past for syncing local and remote files over SSH, but I had never looked at all its options, which according to the manual are, and I am not exaggerating, more than 150, including some for remote file synchronization through a remote shell, for path filtering, for file compression during transfers, and much more.

And, among them, is this hidden gem:

`--link-dest`

This option makes `rsync` check a reference directory before starting the synchronization and:

- If a file in the source directory is also present in the reference directory, it creates a new hard link in the destination directory pointing to the same inode as the file in the reference directory instead of copying it again.
- If not, it copies the file as usual.

This sounds similar to the example above with hard links, doesn't it?

The unique condition is the reference directory must be in the same filesystem as the destination directory.

Of course if the file has been altered in some way and some of the attributes (permissions, ownership, etc.) between the file in the source directory and the file in the reference directory are not exactly identical, `rsync`, by default, treats the file as a new one copying it again.

![rsync --link-dest option](/assets/img/posts/2022-04-03-backups/rsync-link-dest.jpg "Operation of the option --link-dest of rsync")

This makes the process of doing incremental backups with hard links almost automatic.

`rsync` takes care of traversing the directory tree of the previous backup (the directory specified with the `link-dest` param.) and only copies the files that have changed since then: new files or files that have been modified, and creates hard links for the others.

## The final solution for backups

To make our life easier we can automate the process creating a simple script to check if there is a previous backup and to do an incremental backup if so or a full backup if not.

We can add to the script all other interesting options of `rsync` at convenience.

One of my favorites is the `--filter` option with a merge-file:

`rsync -–filter="merge ~/.config/backup/laptop.rules"`

This allows to use external files where to specify the rules for including or excluding files and directories in a very clear way (we can even put comments on them!).

This is the content of my `laptop-linux.rules` file, for example:

```
# include /etc
+ /etc/***

# include /root
+ /root/***

# include /home/alberto
+ /home/
+ /home/alberto/
- /home/alberto/VirtualBox VMs/
- /home/alberto/.cache/
- /home/alberto/.var/
+ /home/alberto/**

# exclude everything else
- *
```

And [this is the script for doing incremental backups](https://github.com/albertoalcolea/dotfiles/blob/master/bin/bin/backup) that I use daily for more than a year.

I have it running on a laptop with dual-boot (Win and Linux) once a day with a cron job and two rule files, one for each OS.

Futhermore, I even use this system for doing backups of my Android smartphone launching temporarily a SSH server on it with a non-privileged user and backuping its content remotely. This method is the fastest I have tried for doing backups of Android devices, faster even than `adb pull`.

## Conclusions

Using `rsync` with `--link-dest` is a great and easy way of creating incremental backups using hard links to keep files already present in previous backups.

It allows to **see, copy and restore any file from any incremental backup easily and quickly** while having a **low disk usage** thanks to the use of hard links.

Of course, it is not as space-efficient with large files and **does not take into account duplicates** as a differential backup system. Backup large files that change constantly (VM files, for example) is a particulary bad case for an incremental backup system, as it has to keep a copy of them on disk for each modification, however this type of files may work aceptably well with a differential backup strategy. If this is not the case, this approach works well and allows **faster recoveries than doing differential backups** in case of disaster.

This strategy can be implemented on almost any place since `rsync`, `ssh` and hard links are supported, in one way or another, in almost all OS and modern file systems.

With these steps you can also have an automatic system to create space-efficient and reliable incremental backups of your all your devices in a simple way.
