const buttonSearch = document.getElementById('btn-search');
const username = document.getElementById('username');

buttonSearch.addEventListener('click', searchProfile);
username.addEventListener('keypress', function(e) {

    if (e.key === 'Enter') {
        searchProfile();
    }
})


function searchProfile() {
    const username = document.getElementById('username').value.replace(/\s+/g, '')
    if(!username) return;
    
    const endpoint = `https://api.github.com/users/${username}`
    const endpointRepos = `https://api.github.com/users/${username}/repos?sort=updated&per_page=10`

    fetch(endpoint)
        .then( res => {
            if(!res.ok) {
                throw new Error('Usuário não encontrado')
            }
            return res.json();
        })
        .then(res => {
            aparecePerfil(res);
        })
        .catch( error => {
            document.getElementById('error').style.display = 'block';
            document.getElementById('profile', 'repos').style.display = 'none';
            alert(error)
        })

    fetch(endpointRepos)
        .then( data => {
            if(!data.ok) {
                throw new Error('Repositórios não encontrado')
            }
            return data.json();
        })
        .then( data => {
            apareceReposositorio(data)
        })
        .catch( error => {
            console.log(error)
        })
}

function aparecePerfil(profile) {
    document.getElementById('error').style.display = 'none';
    document.getElementById('profile').style.display = 'block';

    const avatar = document.getElementById('avatar');
    const name = document.getElementById('name');
    const user = document.getElementById('user');
    const location = document.getElementById('location');
    const twitter = document.getElementById('twitter');
    const bio = document.getElementById('bio');
    const repo = document.getElementById('repo');
    const followers = document.getElementById('followers');
    const folloing = document.getElementById('following');
    
    avatar.src = profile.avatar_url;
    name.innerText = profile.name;
    user.innerText = `@${profile.login}`;
    location.innerHTML = profile.location ? `<i data-feather="map-pin"></i>${profile.location}` : '';
    twitter.innerHTML = profile.twitter_username ? `<i data-feather="twitter"></i> <a href="https://twitter.com/${profile.twitter_username}" target="_blank">@${profile.twitter_username}</a>` : '';
    bio.innerText = profile.bio ? profile.bio : '';
    repo.innerText = profile.public_repos;
    followers.innerText = profile.followers;
    folloing.innerText = profile.following;
}

function apareceReposositorio(repos) {
    const reposList = document.getElementById('repos-list');
    reposList.innerHTML = ''
    document.querySelector('.repos').style.display = 'block';

    if(repos === 0) {
        reposList.innerHTML = '<p>Este usuário não possui repositórios públicos.</p>';
        return;
    } 

    repos.forEach(repo => {
        const repoEl = document.createElement('div');
        repoEl.className = 'repo';

        repoEl.innerHTML = `
            <h4><a href="${repo.html_url}" target="_blank">${repo.name}</a></h4>
            <p>${repo.description || 'Sem descrição'} </p>
            <div class="repo-meta">
                <span><i class='bx  bx-star'></i>  ${repo.stargazers_count}</span>
                <span><i class='bx  bx-git-branch'></i> </i> ${repo.forks_count}</span>
                <span id="icons"><i class='bx  bx-circle' style="background-color: ${repo.language ? '#f1e05a' : '#ccc'} "></i> ${repo.language || 'Nenhuma'}</span>
            </div>
        `;
        reposList.appendChild(repoEl);
    })
}
