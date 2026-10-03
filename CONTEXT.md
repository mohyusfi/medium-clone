# Untad Chronicle Layout & Editorial Context

Editorial digital publication for Universitas Tadulako providing research papers, academic articles, and journalistic stories.

## Language

### Application Shell & Layout

**App Shell**:
The persistent outer frame enclosing the global header, primary navigation sidebar, and main grid layout across pages.
_Avoid_: Page wrapper, global template, master frame

**Pathless Layout Route**:
A TanStack Router structural route that provides shared layout hierarchy without adding a segment to the public URL path.
_Avoid_: Virtual route, prefixless route

**Content Page**:
An individual view responsible strictly for rendering specific topic streams, article feeds, or editorial prose within the main content outlet.
_Avoid_: Screen, page template, view container

**Discovery Rail**:
The secondary contextual sidebar containing curated staff picks, recommended research topics, and author recommendations.
_Avoid_: Right sidebar, widget column, secondary rail
