Armagetron Advanced Authority Generator
=======================================

Authority Generator is a small web application that assists in the creation of
authority configuration files for tournaments.

Features
--------
* Finds all Global IDs in a block of text.
* Validates the existence of Global IDs with the authentication servers.
* Auto-corrects Global IDs that use the wrong subgroup. Examples:
  * dlh@ct => dlh@ct/public
  * dlh@forums/incorrect => dlh@forums

Development
-----------

    $ npm install       # Install dependencies
    $ make run          # For development. Updates source files on change
    $ make dist-install # Create a standalone build

Credits
-------

This project is a derivative implementation of a project created by sinewav.
He was the first to implement an Authority Generator. You can find his
[announcement thread on the armagetronad forums][1].

[1]: http://forums3.armagetronad.net/viewtopic.php?t=21307

License
-------

This project is released under the MIT license. See LICENSE.txt for more
information.
