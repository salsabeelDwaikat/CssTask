document.addEventListener('DOMContentLoaded', () => {
  const jobCardsContainer = document.getElementById('job-cards-container');

  // Handle Edit button click using event delegation
  jobCardsContainer.addEventListener('click', (event) => {
      if (event.target.classList.contains('edit-btn')) {
          const jobCard = event.target.closest('.job-card');
          openEditModal(jobCard);
      }
  });

  // Function to open the modal with job card details
  function openEditModal(jobCard) {
      // Get the current job card details
      const companyLogo = jobCard.querySelector('.company-logo').src;
      const companyName = jobCard.querySelector('.company-name').innerText;
      const jobTitle = jobCard.querySelector('.job-title').innerText;
      const jobDetails = jobCard.querySelector('.job-details').innerText;
      const jobTags = jobCard.querySelector('.job-tags').innerText;
      const jobType = jobCard.querySelector('.job-type').innerText;
      const applicationDeadline = jobCard.querySelector('.application-deadline').innerText;

      // Populate the modal with the current values
      document.getElementById('company-logo').value = companyLogo;
      document.getElementById('company-name').value = companyName;
      document.getElementById('job-title').value = jobTitle;
      document.getElementById('job-details').value = jobDetails;
      document.getElementById('job-tags').value = jobTags;
      document.getElementById('job-type').value = jobType;
      document.getElementById('application-deadline').value = applicationDeadline;

      // Store the job card element for later update
      document.getElementById('job-modal').dataset.editingJobCard = jobCard;
      document.getElementById('job-modal').style.display = 'flex';
  }

  // Function to close the modal
  window.closeJobModal = function () {
      document.getElementById('job-modal').style.display = 'none';
  }

  // Function to handle the form submission
  window.submitJobForm = function (event) {
      event.preventDefault();

      // Get the edited values from the form
      const companyLogo = document.getElementById('company-logo').value;
      const companyName = document.getElementById('company-name').value;
      const jobTitle = document.getElementById('job-title').value;
      const jobDetails = document.getElementById('job-details').value;
      const jobTags = document.getElementById('job-tags').value;
      const jobType = document.getElementById('job-type').value;
      const applicationDeadline = document.getElementById('application-deadline').value;

      // Get the job card to update from the modal's dataset
      const jobCard = document.getElementById('job-modal').dataset.editingJobCard;

      // Update the job card with the new values
      jobCard.querySelector('.company-logo').src = companyLogo;
      jobCard.querySelector('.company-name').innerText = companyName;
      jobCard.querySelector('.job-title').innerText = jobTitle;
      jobCard.querySelector('.job-details').innerText = jobDetails;
      jobCard.querySelector('.job-tags').innerText = jobTags;
      jobCard.querySelector('.job-type').innerText = jobType;
      jobCard.querySelector('.application-deadline').innerText = applicationDeadline;

      // Close the modal
      closeJobModal();
  }
});
