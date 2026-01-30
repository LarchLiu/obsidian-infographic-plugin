# Obsidian Infographic Plugin

Render [AntV Infographic](https://infographic.antv.vision/learn) code blocks inside Obsidian.

## Usage

Create a fenced code block with language `infographic`:

````
```infographic
template: radial-tree
data:
  name: Root
  children:
    - name: A
    - name: B
```
````

More syntax/examples: https://infographic.antv.vision/learn

## Development

```bash
npm install
npm run dev
```

Build:

```bash
npm run build
```
