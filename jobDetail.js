// jobDetail.js
document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search); // Get the query string from the URL
    const jobId = params.get("id"); // Extract the job ID from the URL

    // If a job ID is found, fetch job details
    if (jobId) {
        const jobData = getJobData(jobId); // This function should retrieve job data based on the job ID

        if (jobData) {
            // Populate the job details on the page
            document.querySelector('.job-title').textContent = jobData.title;
            document.querySelector('.job-company').textContent = jobData.company;
            document.querySelector('.job-description').textContent = jobData.description;
        } else {
            console.error('Job not found!');
        }
    } else {
        console.error('Job ID is missing!');
    }
});

// Mock function to retrieve job data based on job ID (replace this with actual logic)
function getJobData(jobId) {
    const jobDatabase = [
        { id: '1', title: 'Software Engineer', company: 'ABC Corp', description: 'Develop software.' },
        { id: '2', title: 'Product Manager', company: 'XYZ Ltd', description: 'Manage product development.' },
    ];

    // Find job by ID
    return jobDatabase.find(job => job.id === jobId);
}

// Assuming you have job cards with the class .job-card
document.querySelectorAll('.job-card').forEach(card => {
    card.addEventListener('click', function() {
        const jobId = this.getAttribute('data-job-id'); // Get job ID from the data attribute
        if (jobId) {
            // Redirect to job detail page with the job ID in the URL
            window.location.href = `../jobHtml/jobDetail.html?id=${jobId}`;
        }
    });
});
