// Runs in the page's MAIN world (see manifest "world": "MAIN").
// React stores its fiber as an expando property on each DOM node, which is invisible to the
// isolated content-script world. This bridge reads the act data from those fibers and stamps it
// onto each tile as data-* attributes, which the content script (content.js) can then read.
(function() {
    'use strict';

    console.log('%c[TML Filter] fiber-bridge loaded (MAIN world)', 'color:#d4af37;font-weight:bold');

    function readProgramFiber(el) {
        const key = Object.keys(el).find(k => k.startsWith('__reactFiber$') || k.startsWith('__reactInternalInstance$'));
        let fiber = key ? el[key] : null;
        let depth = 0;
        while (fiber && depth < 50) {
            const props = fiber.memoizedProps;
            if (props) {
                const candidates = [
                    props.programItem && props.programItem.program && props.programItem.program.data,
                    props.program && props.program.data,
                    props.data,
                    props.program,
                ];
                for (const c of candidates) {
                    if (c && (c.title || c.since || c.startTime)) return c;
                }
            }
            fiber = fiber.return;
            depth++;
        }
        return null;
    }

    function toIsoLike(v) {
        if (v == null) return '';
        if (v instanceof Date) return isNaN(v) ? '' : v.toISOString();
        return String(v);
    }

    function stamp(root) {
        const programs = root.querySelectorAll('[class*="e1ojkxpe1"], [class*="_program_"], .planby-program');
        programs.forEach(p => {
            if (p.dataset.tmlId) return; // already stamped
            const d = readProgramFiber(p);
            if (!d || d.id == null) return;
            p.dataset.tmlId = String(d.id);
            if (d.title) p.dataset.tmlName = d.title;
            if (d.description) p.dataset.tmlStage = d.description;
            const since = toIsoLike(d.since || d.startTime);
            const till = toIsoLike(d.till || d.endTime);
            if (since) p.dataset.tmlStart = since;
            if (till) p.dataset.tmlEnd = till;
        });
    }

    function init() {
        stamp(document);
        const observer = new MutationObserver(() => stamp(document));
        observer.observe(document.body, { childList: true, subtree: true });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
