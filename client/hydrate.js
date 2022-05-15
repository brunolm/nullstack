import { anchorableElement } from './anchorableNode';

export default function hydrate(selector, node) {
  if (node.head) {
    node.element = document.getElementById(node.attributes.id)
    return
  }
  if (node?.attributes?.html) {
    anchorableElement(selector);
  }
  node.element = selector
  for (const element of selector.childNodes) {
    if ((element.tagName === 'TEXTAREA' || element.tagName === 'textarea') && element.childNodes.length === 0) {
      element.appendChild(document.createTextNode(''));
    } else if (element.COMMENT_NODE === 8 && element.textContent === '#') {
      element.remove()
    }
  }
  if (!node.children) return
  const limit = node.children.length;
  for (let i = limit - 1; i > -1; i--) {
    hydrate(selector.childNodes[i], node.children[i])
  }
}