# PRE-RELEASE project preview

So that the project can be tried out before the official release and the project code is committed to npm with
a new version assignment.

GitHub action pre-release-branch-update was added to the project, which after commit to the main (master)
branch performs the project build, enabling saving the result in git, and saves the result to the pre-release branch.

Later, this code can be tested by adding to a project using command *npm install \<project repo\>#pre-release*.

When making changes to a project and building a new pre-release version by git push. It is **necessary**
to update the code of the component in test projects via *npm update*.
