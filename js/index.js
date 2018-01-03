window.onload = function() {
    let setA = new Set()
    setA.add(1)
    setA.add(2)
    setA.add(3)
    let setB = new Set()
    setB.add(10)
    setB.add(11)
    setB.add(12)
}



function LinkList() {
    let Node = function(element) {
        this.element = element
        this.next = null
    }
    let length = 0
    let head = null
    this.append = function(element) {
            let node = new Node(element),
                current

            if (head === null) {
                head = node
            } else {
                current = head
                while (current.next) {
                    current = current.next
                }
                current.next = node
            }
            length++
        }
        // 移除指定位置的element
    this.removeAt = function(position) {
        let current = head,
            previous, index = 0

        if (position > -1 && position < length) {
            if (position === 0) {
                head = current.next
            } else {
                // 一直循环比遍历到制定位置
                while (index++ < position) {
                    previous = current
                    current = current.next
                }
                previous.next = current.next
            }
            length--
            return current.element
        } else {
            return null
        }
    }
    this.insert = function(position, element) {
        if (position >= 0 && position <= length) {
            let node = new Node(element),
                current = head,
                index = 0
            if (position === 0) {
                node.next = current
                head = node
            } else {
                while (index++ < position) {
                    previous = current
                    current = current.next
                }
                previous.next = node
                node.next = current
            }
            length++
            return true
        } else {
            return false
        }
    }
    this.toString = function() {
        let current = head,
            string = ''
        while (current) {
            string += current.element + (current.next ? '&' : '')
            current = current.next
        }
        return string
    }
    this.indexOf = function(element) {
        let current = head,
            index = 0
        while (current) {
            if (element === current.element) {
                return index
            }
            index++
            current = current.next
        }
        return -1
    }
    this.remove = function(element) {
        let index = this.indexOf(element)
        this.removeAt(index)
    }
    this.size = function() {
        return length
    }
    this.isEmpty = function() {
        return length === 0
    }
    this.getHead = function() {
        return head
    }
}

function doubleLink() {
    let Node = function(element) {
        this.element = element
        this.next = null
        this.prev = null
    }
    let length = 0
    let head = null
    let tail = null
    this.append = function(element) {
            let node = new Node(element),
                current, prvious
                // 第一个元素
            if (head === null) {
                head = node
                tail = node
            } else {
                current = head
                while (current.next) {
                    previous = current
                    current = current.next
                    current.prev = previous
                }
                current.next = node
                node.prev = current
                tail = node
            }
            length++
        }
        // 移除指定位置的element
    this.removeAt = function(position) {
        let current = head,
            previous, index = 0

        if (position > -1 && position < length) {
            if (position === 0) {
                head = current.next
                if (length === 1) {
                    tail = null
                } else {
                    head.prev = null
                }
            } else if (position === length - 1) {
                current = tail
                tail = current.prev
                tail.next = null
            } else {
                // 一直循环比遍历到制定位置
                while (index++ < position) {
                    previous = current
                    current = current.next
                }
                previous.next = current.next
                current.next.prev = previous
            }
            length--
            return current.element
        } else {
            return null
        }
    }
    this.insert = function(position, element) {
        if (position >= 0 && position <= length) {
            let node = new Node(element),
                current = head,
                previous,
                index = 0
            if (position === 0) {
                if (!head) {
                    head = node
                    tail = node
                } else {
                    node.next = current
                    current.prev = node
                    head = node
                }
            } else if (position === length) {
                current = tail
                current.next = node
                node.prev = current
                tail = node
            } else {
                while (index++ < position) {
                    previous = current
                    current = current.next
                }
                previous.next = node
                node.next = current

                node.prev = previous
                current.prev = node
            }
            length++
            return true
        } else {
            return false
        }
    }
    this.toString = function() {
        let current = head,
            string = ''
        while (current) {
            string += current.element + (current.next ? '&' : '')
            current = current.next
        }
        return string
    }
    this.indexOf = function(element) {
        let current = head,
            index = 0
        while (current) {
            if (element === current.element) {
                return index
            }
            index++
            current = current.next
        }
        return -1
    }
    this.remove = function(element) {
        let index = this.indexOf(element)
        this.removeAt(index)
    }
    this.size = function() {
        return length
    }
    this.isEmpty = function() {
        return length === 0
    }
    this.getHead = function() {
        return head
    }
}