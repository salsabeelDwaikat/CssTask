document.addEventListener('DOMContentLoaded', () => {
    const jobCardsContainer = document.querySelector('.job-cards-container');

    if (!jobCardsContainer) {
        console.error('Job cards container not found.');
        return;
    }

    let jobs = JSON.parse(localStorage.getItem('jobs')) || [
        {
            id: 1,
            companyName: 'Photosnap',
            logo: 'logos/logo1.jpeg',
            jobTitle: 'Senior Frontend Developer',
            posted: '1d ago',
            jobType: 'Full Time',
            location: 'USA Only',
            tags: ['Frontend', 'Senior', 'HTML', 'CSS', 'JavaScript'],
            isNew: true,
            isFeatured: true
        },
        {
            id: 2,
            companyName: 'Manage',
            logo: 'logos/logo2.jpeg',
            jobTitle: 'Fullstack Developer',
            posted: '5d ago',
            jobType: 'Part Time',
            location: 'Remote',
            tags: ['Fullstack', 'Midweight', 'Python', 'React'],
            isNew: true,
            isFeatured: false
        },
        {
            id: 3,
            companyName: 'Account',
            logo: 'logos/logo3.jpeg',
            jobTitle: 'Junior Backend Developer',
            posted: '2w ago',
            jobType: 'Contract',
            location: 'Worldwide',
            tags: ['Frontend', 'JavaScript', 'React', 'Sass'],
            isNew: false,
            isFeatured: false
        },
        {
            id: 4,
            companyName: 'WebCorp',
            logo: 'logos/logo4.jpeg',
            jobTitle: 'Senior UX Designer',
            posted: '3d ago',
            jobType: 'Full Time',
            location: 'Canada',
            tags: ['UX', 'Design', 'Figma', 'User Research'],
            isNew: false,
            isFeatured: true
        },
        {
            id: 5,
            companyName: 'InnovateX',
            logo: 'logos/logo5.jpeg',
            jobTitle: 'Data Scientist',
            posted: '1w ago',
            jobType: 'Part Time',
            location: 'Europe Only',
            tags: ['Data', 'Python', 'Machine Learning', 'AI'],
            isNew: true,
            isFeatured: false
        },
    ];

    console.log('Jobs loaded:', jobs); 

    // Function to create a new job card dynamically
    function createJobCard(job) {
        console.log('Creating job card for:', job);
        const card = document.createElement('div');
        card.classList.add('job-card');
        card.setAttribute('data-id', job.id); 
        card.setAttribute('tabindex', '0');
        card.addEventListener('click', () => navigateToDetail(`jobHtml/jobDetail.html?id=${job.id}`));

        const logoContainer = document.createElement('div');
        logoContainer.classList.add('company-logo');
        logoContainer.style.backgroundImage = `url('${job.logo}')`;
        card.appendChild(logoContainer);

        const detailsContainer = document.createElement('div');
        detailsContainer.classList.add('job-details');
        const companyName = document.createElement('span');
        companyName.classList.add('tag-name');
        companyName.textContent = job.companyName;
        detailsContainer.appendChild(companyName);

        if (job.isNew) {
            const newTag = document.createElement('span');
            newTag.classList.add('tag-new');
            newTag.textContent = 'NEW!';
            detailsContainer.appendChild(newTag);
        }

        if (job.isFeatured) {
            const featuredTag = document.createElement('div');
            featuredTag.classList.add('tag-featured');
            featuredTag.textContent = 'FEATURED';
            detailsContainer.appendChild(featuredTag);
        }

        const jobTitle = document.createElement('h3');
        jobTitle.textContent = job.jobTitle;
        detailsContainer.appendChild(jobTitle);

        const jobMeta = document.createElement('p');
        jobMeta.textContent = `${job.posted} • ${job.jobType} • ${job.location}`;
        detailsContainer.appendChild(jobMeta);

        const tagsContainer = document.createElement('div');
        tagsContainer.classList.add('job-tags');
        job.tags.forEach(tag => {
            const tagElement = document.createElement('span');
            tagElement.textContent = tag;
            tagElement.addEventListener('click', () => filterJobsByTag(tag));
            tagsContainer.appendChild(tagElement);
        });
        detailsContainer.appendChild(tagsContainer);

        card.appendChild(detailsContainer);

        const actionsContainer = document.createElement('div');
        actionsContainer.classList.add('job-actions');

        const editButton = document.createElement('div');
        editButton.classList.add('icon-container', 'edit-btn');
        const editIcon = document.createElement('i');
        editIcon.classList.add('fas', 'fa-pen');
        editButton.appendChild(editIcon);
        const editTooltip = document.createElement('span');
        editTooltip.classList.add('tooltip');
        editTooltip.textContent = 'Edit';
        editButton.appendChild(editTooltip);
        editButton.addEventListener('click', (e) => {
            e.stopPropagation();
            openEditModal(job);
        });
        actionsContainer.appendChild(editButton);

        const deleteButton = document.createElement('div');
        deleteButton.classList.add('icon-container', 'delete-btn');
        const deleteIcon = document.createElement('i');
        deleteIcon.classList.add('fas', 'fa-times');
        deleteButton.appendChild(deleteIcon);
        const deleteTooltip = document.createElement('span');
        deleteTooltip.classList.add('tooltip');
        deleteTooltip.textContent = 'Delete';
        deleteButton.appendChild(deleteTooltip);
        deleteButton.addEventListener('click', (e) => {
            e.stopPropagation();
            deleteJob(job.id);
        });
        actionsContainer.appendChild(deleteButton);

        card.appendChild(actionsContainer);
        jobCardsContainer.appendChild(card);
    }

    // Render all job cards from data
    if (jobs && Array.isArray(jobs) && jobs.length > 0) {
        jobs.forEach(job => createJobCard(job));
    } else {
        console.error('No jobs available.');
    }

    // Function to navigate to job detail page
    function navigateToDetail(url) {
        window.location.href = url;
    }

    // Function to filter jobs by tag
    function filterJobsByTag(tag) {
        console.log('Filter jobs by tag:', tag);
    }

    // Function to handle job editing
    function openEditModal(job) {
        const modal = document.getElementById('job-modal');
        const jobTitleInput = document.getElementById('job-title');
        const companyNameInput = document.getElementById('company-name');
        const jobTagsInput = document.getElementById('job-tags');
        const jobTypeInput = document.getElementById('job-type');

        // Pre-fill the form with current job details
        jobTitleInput.value = job.jobTitle;
        companyNameInput.value = job.companyName;
        jobTagsInput.value = job.tags.join(', ');
        jobTypeInput.value = job.jobType;

        // Set up form submission
        window.submitJobForm = function(event) {
            event.preventDefault();

            const updatedJobTitle = jobTitleInput.value;
            const updatedCompanyName = companyNameInput.value;
            const updatedTags = jobTagsInput.value.split(',').map(tag => tag.trim());
            const updatedJobType = jobTypeInput.value;

            job.jobTitle = updatedJobTitle;
            job.companyName = updatedCompanyName;
            job.tags = updatedTags;
            job.jobType = updatedJobType;

            // Save updated job to localStorage
            localStorage.setItem('jobs', JSON.stringify(jobs));

            // Update the job card in the UI
            updateJobCard(job);

            closeJobModal(); 
        };

        modal.style.display = 'block';
    }

    // Function to update the job card in the UI after editing
    function updateJobCard(job) {
        const jobCard = document.querySelector(`.job-card[data-id='${job.id}']`);
        if (jobCard) {
            const jobTitle = jobCard.querySelector('h3');
            const companyName = jobCard.querySelector('.tag-name');
            const jobMeta = jobCard.querySelector('p');
            const tagsContainer = jobCard.querySelector('.job-tags');

            jobTitle.textContent = job.jobTitle;
            companyName.textContent = job.companyName;
            jobMeta.textContent = `${job.posted} • ${job.jobType} • ${job.location}`;

            // Update tags
            tagsContainer.innerHTML = '';
            job.tags.forEach(tag => {
                const tagElement = document.createElement('span');
                tagElement.textContent = tag;
                tagsContainer.appendChild(tagElement);
            });
        }
    }

    // Function to handle job deletion
    function deleteJob(jobId) {
        const jobCard = document.querySelector(`.job-card[data-id='${jobId}']`);
        if (jobCard) {
            jobCard.remove();
            jobs = jobs.filter(job => job.id !== jobId);
            localStorage.setItem('jobs', JSON.stringify(jobs)); // Update localStorage
        }
    }

    // Function to toggle light/dark mood
    function toggleMood() {
        console.log('Toggling mood');
        const body = document.body;
        body.classList.toggle("dark-mode");
    
        const moodButton = document.querySelector(".mood-btn");
        moodButton.textContent = body.classList.contains("dark-mode") ? "☀️" : "🌙";
    }

    // Attach event listener for the mood toggle button
    const moodButton = document.querySelector(".mood-btn");
    if (moodButton) {
        moodButton.addEventListener("click", toggleMood);
    }

    // Open the job modal
    window.openJobModal = function() {
        const modal = document.getElementById('job-modal');
        modal.style.display = 'block';
    }

    // Close the job modal
    window.closeJobModal = function() {
        const modal = document.getElementById('job-modal');
        modal.style.display = 'none';
    }

    // Submit the new job form
    window.submitJobForm = function(event) {
        event.preventDefault();

        const companyLogo = document.getElementById('company-logo').value;
        const companyName = document.getElementById('company-name').value;
        const jobTitle = document.getElementById('job-title').value;
        const jobDetails = document.getElementById('job-details').value;
        const jobTags = document.getElementById('job-tags').value.split(',').map(tag => tag.trim());
        const jobType = document.getElementById('job-type').value;

        const newJob = {
            id: jobs.length + 1,
            logo: companyLogo,
            companyName,
            jobTitle,
            jobDetails,
            jobTags,
            jobType
        };

        jobs.push(newJob);
        localStorage.setItem('jobs', JSON.stringify(jobs)); 

        createJobCard(newJob);
        closeJobModal();
    }

});
