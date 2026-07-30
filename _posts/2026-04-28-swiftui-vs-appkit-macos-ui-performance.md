---
layout: post
title: 'AppKit vs SwiftUI on macOS: Layout, Performance, and Trade-offs'
description: 'A comparison of AppKit and SwiftUI as macOS UI frameworks, covering layout, rendering, and performance at scale, plus where UIKit and Mac Catalyst fit in.'
date: 2026-04-28 06:53:39 CDT -0500
modified_date: 2026-07-29 20:04:04 -0500
categories: ['Articles']
tags: ['swift', 'macos', 'swiftui', 'appkit', 'performance']
image: '/assets/uploads/2025/04/swiftui-vs-appkit-on-macos-layout-models-performance-and-trade-offs-social-share-image.webp'
---

AppKit and SwiftUI are the two frameworks for building native macOS user interfaces. AppKit builds an interface out of `NSView` objects that you configure and update yourself, and SwiftUI takes a description of the interface for a given state and works out the updates. Below is how each one works, what the trade-offs are, how they interoperate, and what the alternatives are when neither fits. The performance sections use a macOS image viewer application I built as the example.

---

## The Two Frameworks

### AppKit / NSView

[AppKit](https://developer.apple.com/documentation/appkit) has been the native macOS UI framework since it shipped as part of [NeXTSTEP in 1989](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/CocoaFundamentals/WhatIsCocoa/WhatIsCocoa.html). Every view in AppKit descends from [`NSView`](https://developer.apple.com/documentation/appkit/nsview), which is a rectangle on screen responsible for its own drawing, event handling, and layout.

AppKit is imperative. You create view objects, set properties on them, add them as subviews, and describe layout using Auto Layout constraints or manual frame math. When something changes, you update the view directly.

The framework gives you full control over the rendering pipeline. Views can be [layer-backed](https://developer.apple.com/documentation/appkit/nsview/wantslayer), which caches their drawing in a Core Animation layer, or they can draw directly into a graphics context using `drawRect:`. You can use Metal directly if you need custom GPU rendering. You decide when things redraw, how memory is managed, and how updates are batched.

[`NSCollectionView`](https://developer.apple.com/documentation/appkit/nscollectionview) and [`NSTableView`](https://developer.apple.com/documentation/appkit/nstableview) are the primary tools for displaying large collections of items, and both recycle a fixed pool of view objects as the user scrolls. [`makeView(withIdentifier:owner:)`](https://developer.apple.com/documentation/appkit/nstableview/makeview%28withidentifier:owner:%29) returns a reused view with the same identifier that is no longer on screen, and [`makeItem(withIdentifier:for:)`](https://developer.apple.com/documentation/appkit/nscollectionview/makeitem%28withidentifier:for:%29) does the same for collection view items. Because the size of that pool tracks the visible area and not the number of items, memory use stays flat as the collection grows.

### SwiftUI

Apple announced SwiftUI on [June 3, 2019](https://www.apple.com/newsroom/2019/06/apple-unveils-groundbreaking-new-technologies-for-app-development/). It is declarative, so you describe what the UI should look like for a given state and the framework works out what to create, update, or remove. You [declare a custom SwiftUI view as a structure](https://developer.apple.com/documentation/swiftui/declaring-a-custom-view) that conforms to the [`View`](https://developer.apple.com/documentation/swiftui/view) protocol, which makes it a value type holding a description of an interface, and SwiftUI reads its `body` property every time it needs to update what is drawn on screen.

When a value held in [`@State`](https://developer.apple.com/documentation/swiftui/state) changes, SwiftUI updates the parts of the view hierarchy that depend on that value. The underlying UIKit (on iOS) or AppKit (on macOS) objects are managed by SwiftUI internally. You do not interact with them directly in most cases.

[`LazyVGrid`](https://developer.apple.com/documentation/swiftui/lazyvgrid) and [`LazyHGrid`](https://developer.apple.com/documentation/swiftui/lazyhgrid) arrange child views in a grid and create items only as they are needed to render on screen.

### Where UIKit Fits

[UIKit](https://developer.apple.com/documentation/uikit) is the iOS counterpart to AppKit, the imperative, `UIView`-based framework for iOS, iPadOS, and tvOS interfaces. It is not a macOS UI framework. Apple's own guidance is that a macOS app uses SwiftUI or AppKit, and that a UIKit iPad app reaches the Mac through [Mac Catalyst](https://developer.apple.com/documentation/uikit/mac-catalyst), which is covered below in Other Options. A three-way "AppKit vs UIKit vs SwiftUI" question is therefore two separate choices on two platforms, because AppKit vs SwiftUI is the decision for a Mac-native app and UIKit vs SwiftUI is the same decision on iOS. SwiftUI is the only one of the three that targets both platforms from a single description, rendering down to AppKit on macOS and UIKit on iOS underneath.

---

## Fundamental Differences

|                   | AppKit                      | SwiftUI                                                |
| ----------------- | --------------------------- | ------------------------------------------------------ |
| Paradigm          | Imperative                  | Declarative                                            |
| View type         | Reference (class)           | Value (struct)                                         |
| Layout            | Auto Layout / manual frames | Compositional layout system                            |
| Cell reuse        | Explicit, manual            | Handled internally (Lazy variants)                     |
| State management  | Manual                      | Reactive (`@State`, `@StateObject`, `@ObservedObject`) |
| Rendering control | Full                        | Limited                                                |
| Interoperability  | Via `NSViewRepresentable`   | Via `NSHostingView`                                    |
| Introduced        | 1989 (NeXT)                 | 2019                                                   |

### Value Types and Reference Types

The table above says an AppKit view is a class and a SwiftUI view is a struct. A struct groups related data together with the functions that operate on it. Swift structs can hold stored properties and computed properties and can define methods, so they cover most of what a class does.

They differ in what happens when you pass one to a function. [A value type is a type whose value is copied when it's assigned to a variable or constant, or when it's passed to a function](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/classesandstructures), and every Swift struct is a value type. The function gets its own copy, so anything it changes there is invisible to the caller. A class is a reference type, so the function gets a pointer to the same instance, and a change it makes shows up everywhere else that holds a reference to it.

Apple's guidance is to [use structures by default](https://developer.apple.com/documentation/swift/choosing-between-structures-and-classes), and to use a class when you need Objective-C interoperability or when two parts of your code have to share one instance and see each other's changes to it. Swift's own basic types follow that rule, since integers, strings, arrays, and dictionaries are all implemented as structures.

This is why a SwiftUI view is cheap to create and why an AppKit view is not. Creating a SwiftUI view copies a small value that describes an interface. Creating an AppKit view allocates an object that lives until something stops referencing it.

### How Layout Works in AppKit

AppKit uses Auto Layout, a constraint solver that computes frames from a set of linear equations, and you can also set frames directly. A layout pass runs top-down through three steps:

- AppKit calls the parent view's [`layout()`](https://developer.apple.com/documentation/appkit/nsview/layout%28%29) method
- the parent positions its children
- each child runs the same pass over its own subviews

Auto Layout is predictable and fast when constraints are well-formed, and slow when constraints are ambiguous or when layout passes run more often than they need to.

### How Layout Works in SwiftUI

SwiftUI uses a proposal-response model, in which a parent passes each child a [`ProposedViewSize`](https://developer.apple.com/documentation/swiftui/proposedviewsize), the child chooses its own size in response, and the parent positions the child at that size. A parent can send several proposals to the same child, including zero, infinity, and the child's ideal size, to find out how flexible the child is. This is simpler to reason about than Auto Layout for the common case and gives you less direct control.

Every state change causes SwiftUI to re-evaluate the affected part of the view hierarchy. SwiftUI compares view types and identifiers to limit how much of the hierarchy it re-evaluates, and the cost of doing that grows with the depth and complexity of the hierarchy.

---

## Performance Characteristics

### Large Collections

AppKit's `NSCollectionView` with an [`NSCollectionViewDiffableDataSource`](https://developer.apple.com/documentation/appkit/nscollectionviewdiffabledatasource) handles thousands of items, because cell reuse keeps memory flat and the diffable data source applies a whole snapshot at once with animated transitions. The collection view asks [your data source](https://developer.apple.com/documentation/appkit/nscollectionviewdatasource/collectionview%28_:itemforrepresentedobjectat:%29) for an item at the point where it needs to display one, so the work scales with the visible area instead of the size of the collection.

SwiftUI's `LazyVGrid` creates items only as it needs to render them, so it avoids building views for items far outside the visible area the way a plain `VStack` inside a [`ScrollView`](https://developer.apple.com/documentation/swiftui/scrollview) would. It does not recycle a pool of views the way `NSCollectionView` does. A SwiftUI view struct is cheap to create, but the AppKit view behind it is an object, so each cell that scrolls into view means allocating and configuring a new `NSView`. At tens of thousands of items that produces noticeable stuttering during fast scrolling that `NSCollectionView` does not.

For moderate collection sizes (a few hundred to a few thousand items) `LazyVGrid` is usually adequate.

### Main Thread Constraints

Both frameworks run UI on the main thread. AppKit is imperative, so you decide what runs on the main thread and when. SwiftUI declares the [`body`](https://developer.apple.com/documentation/swiftui/view/body-8kl5o) property as `@MainActor` and reads it every time state changes, so any expensive work you put inside `body` blocks rendering.

The pattern that works in SwiftUI is to move any work that is not building the UI into a background task and then write the results to state on the main actor. Nothing in the framework enforces that, so you have to do it every time by hand.

### Memory

AppKit views are objects. A complex view hierarchy with many subviews consumes proportional memory, regardless of visibility. The cell reuse pattern in `NSTableView` and `NSCollectionView` exists specifically to bound memory use for large collections.

A SwiftUI view is a struct, so it holds only its own stored properties and is copied by value instead of being allocated on the heap and reference counted. The underlying AppKit views that SwiftUI manages internally are still objects, but SwiftUI controls their lifecycle. In the image viewer I saw `LazyVGrid` release backing views that scrolled far out of the visible area, but it released them later than a fixed AppKit reuse pool would have.

---

## A Concrete Example: The Image Viewer

The image viewer application referenced in this post ([source on GitHub](https://github.com/Blake-C/macos-image-viewer-application)) was built entirely in SwiftUI. The gallery view uses `LazyVGrid` with async thumbnail loading and an LRU cache. The metadata panel parses image metadata and displays it in a scrollable list.

Two performance problems came up while building it.

**Thumbnail grid at scale.** For folders with several thousand images, scrolling fast in the `LazyVGrid` produces occasional frame drops, which an `NSCollectionView` implementation would avoid because of cell reuse. The use I built for is browsing a shoot of a few hundred images, and at that size `LazyVGrid` is fast enough that I kept the simpler SwiftUI implementation. At the size of a full photo library that same trade-off would not hold.

**Metadata panel blocking.** The metadata panel parses ComfyUI workflow JSON embedded in image metadata. Some of that JSON is large. The initial implementation called the parser synchronously in the view's `body`-derived computed property. This blocked the main thread during modal presentation, causing a visible delay before the sheet appeared.

The fix had three parts:

- move the parse into a `Task.detached(priority: .userInitiated)` block
- display a placeholder immediately
- update state when the parse completes

The modal now opens in under a frame. SwiftUI makes this mistake easy to write and takes explicit effort to fix, while AppKit's imperative model makes the threading boundary more obvious because you are writing the update code yourself.

---

## Mixing the Two

AppKit and SwiftUI interoperate in both directions. [`NSViewRepresentable`](https://developer.apple.com/documentation/swiftui/nsviewrepresentable) is a wrapper you adopt to create and manage an `NSView` inside a SwiftUI view hierarchy, and [`NSHostingView`](https://developer.apple.com/documentation/swiftui/nshostingview) is an `NSView` subclass that hosts a SwiftUI view hierarchy inside an AppKit one.

The image viewer application does this in several places. The zoom and pan in the full-image view uses an `NSEvent` local monitor for trackpad pinch gestures because SwiftUI does not expose that event directly. The window title bar updates go through `NSWindow` accessed via an `NSViewRepresentable` helper because SwiftUI has no API for setting the window title imperatively.

Most of the interface is SwiftUI, and AppKit covers the parts SwiftUI has no API for.

---

## Other Options

### Catalyst

Mac Catalyst lets you make a Mac version of a UIKit iPad app by checking the Mac box in the iPad app's project settings, and the two versions share one project and one source tree. The result runs on macOS without being built out of AppKit views, and the UI conventions, scrolling behavior, and window management all come from iPadOS. It is useful for bringing an existing iOS app to the Mac without rewriting it. It is not a good starting point for a Mac-first application.

I have not shipped a Catalyst app myself yet. Most of my hands-on work building apps with AI tools like Claude Code has been in UIKit on iOS, and for the Mac work behind this post SwiftUI has been good enough for what I needed. Catalyst is on my list to experiment with, to see where a shared UIKit codebase is worth the compromises it makes on the Mac. Treat that as a direction I want to explore. It is not a recommendation.

### Flutter

Flutter is a cross-platform UI framework from Google that [bypasses the system UI widget libraries in favor of its own widget set](https://docs.flutter.dev/resources/architectural-overview) and paints them itself, so a Flutter macOS app displays frames it renders through Metal or OpenGL and uses no AppKit views. Which engine does that rendering [depends on the platform](https://docs.flutter.dev/perf/impeller).

- Impeller is the only rendering engine on iOS, with no way to switch to Skia
- Impeller is enabled by default on Android API 29 and above, and falls back to OpenGL below that
- Flutter on the web uses Skia
- on macOS, Impeller is behind the `--enable-impeller` flag

Drawing everything itself gives Flutter consistent rendering across platforms and means the application does not pick up macOS accessibility, system themes, or platform conventions. Performance for static content is generally good, and performance for large scrolling lists depends on Flutter's own recycling implementation.

### Qt

Qt is a C++ framework that [supports macOS 13 and higher](https://doc.qt.io/qt-6/macos.html) as a target. It has its own layout system and rendering pipeline, and like Flutter it draws its own widgets rather than using native views, because [Qt's built-in widgets use `QStyle` to perform nearly all of their drawing](https://doc.qt.io/qt-6/qstyle.html) so that they look like the equivalent native widgets. Qt is a reasonable choice for cross-platform desktop applications, particularly when the team is already writing C++. I have not seen it used for a Mac-first application, though I have not gone looking for counterexamples.

### Electron

Electron [embeds Chromium and Node.js into its binary](https://www.electronjs.org/docs/latest/), and the UI is built with JavaScript, HTML, and CSS, so an Electron app on macOS uses no AppKit views. Memory use is high relative to native alternatives. [VS Code runs in an Electron shell](https://code.visualstudio.com/docs/supporting/faq) and [Slack's desktop app is an Electron container around its web app](https://slack.engineering/growing-pains-migrating-slacks-desktop-app-to-browserview/). I read those two shipping at that size as a sign that the performance ceiling is higher than the criticism of Electron usually implies.

---

## Summary

AppKit gives you direct control over the rendering pipeline, explicit cell reuse for large collections, and a mature set of controls with decades of macOS-specific behavior built in. It is verbose and requires more code to do the same thing SwiftUI does declaratively.

SwiftUI is faster to write, easier to maintain, and handles state synchronization automatically. It works well for moderate-scale UIs. It has real performance limits for very large collections and requires explicit threading discipline to avoid blocking the main thread.

For a new macOS application that is NOT displaying a library of 100,000 items, SwiftUI is the reasonable default. At that scale, `NSCollectionView` with cell reuse and async prefetching is what keeps memory flat and scrolling smooth.

The two frameworks can be used in the same application. Using SwiftUI for the majority of an application and AppKit for the pieces where performance or platform integration requires it is a normal and supported approach.
