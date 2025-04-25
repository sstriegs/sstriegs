function toggleDetails(row) {
    // Toggle expanded class
    row.classList.toggle('expanded');
}

// Make sure our expanded row shows properly on page load
document.addEventListener('DOMContentLoaded', function() {
    var expandedRows = document.querySelectorAll('.project-row.expanded');
    expandedRows.forEach(function(row) {
        var detailsRow = row.nextElementSibling;
        if (detailsRow && detailsRow.classList.contains('project-details')) {
            detailsRow.style.display = 'table-row';
        }
    });
});
