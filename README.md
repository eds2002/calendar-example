# React native week calendar example

This example tries to mimick the iOS calendar app, specifically the week component

If you intend to use react-native-pager-view inside a scrollview, or a scrollable component, you will need this [patch](https://github.com/callstack/react-native-pager-view/issues/955#issuecomment-2584414768)
if not ur good to go

You could possibly benefit from using a flashlist instead of a flatlist in the strip component but from what I've tested its pretty good



Tested in ios only sorry :-(


1) npm install
2) npm expo prebuild --clean && npm expo run ios (or android)
