# Antimatter Dimensions - Break Eternity Port
Note: You are currently viewing the refactor branch of the codebase.

This is the branch that all pull requests, issues and updates are focused on.


If you are modding and decide to fork the repository, change the main branch back
to "main" in settings -> default branch.


The main branch will remain unmodified until refactor is considered complete, at which point
this branch will be merged into main, and this branch will be deleted in favor of main.]

Interested in modding AD? Here's the [discord](https://discord.gg/9p9DknraUr)

## Modifying
This repository is worked on using Visual Studio Code and if you don't know what you are doing, you should use so aswell.
- Fork the repository - This is the repo you will use
- Open your code editor
- Find your remote repository button - For VSCode, this is called Source Control
- Click "Add a local repository" or the equivilent
- On the github repo, click "Code", "HTTPS", and then copy the url
- Paste the URL into the box and press enter
- For modifying other branches (i.e. not main):
  - Install Git ([link](https://git-scm.com/downloads/win))
  - Open terminal (You can open it via the top in VSCode, or use any command line terminal)
  - Run `git branch` to list all branches
  - Run `git switch x` (where x is the branch you want) to swap branch
- You now have access to the repository
- Making a pull request:
  - Go to the main repository (maybe the one you are on right now)
  - Go to the "Pull Requests" tab
  - Click "New Pull request"
  - Here you can add a title, a description, then make a pull request
  - (A pull request is basically a request for someone to merge your code into theirs)
- Updating your local repository
  - On your repository, click the "Sync" button.
  - Assuming you have not done anything major, you should be able to do so without any conflicts
    - If there are conflicts, you will need to resolve them by hand
  - You can then go to "Source Control" -> "Pull" or run `git pull` to pull any changes
    - This will pull changes from **your** repository, not this repository, so sync first.

## Run

To run the game locally, you will need to install
[Node.js](https://nodejs.org/) (v20 LTS recommended).

First, run the following command in your terminal (or command line) while being
inside the checked out repository:

```
npm ci
```

After all the packages are installed, start up the game:

```
npm run dev
```

This will make the game served via your localhost, and the playable link will
be displayed in your terminal. The server **doesn't** need to be restarted
after you've made changes - just reload the page (if it doesn't reload automatically).
The server **can** occasionally crash, so check your terminal from time to time and run `dev`
again if needed.
