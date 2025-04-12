function toggleBranch(id) {
  document.querySelectorAll('.branch-details').forEach(branch => {
    branch.style.display = (branch.id === id) ? 'block' : 'none';
  });

  // Close all nested sub-branches when switching main branches
  document.querySelectorAll('.branch-details .sub-branch').forEach(el => {
    if (!el.classList.contains('always-open')) {
      el.classList.remove('open');
      el.style.display = 'none';
    }
  });
}

function toggleSubBranch(subId) {
  const el = document.getElementById(subId);
  if (el) {
    el.classList.toggle('open');
    el.style.display = el.classList.contains('open') ? 'block' : 'none';
  }
}

window.addEventListener('load', () => {
  document.querySelectorAll('.branch-details').forEach(branch => {
    branch.style.display = 'none';
  });

  document.querySelectorAll('.sub-branch').forEach(el => {
    if (!el.classList.contains('open')) {
      el.style.display = 'none';
    }
  });
});