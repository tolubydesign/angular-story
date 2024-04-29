---
id: deployment
chapter: Deployment
---


## Basics 

For a smooth and repeatable deployment process, this project utilises GitHub Workflows, GitHub Actions, GitHub Environment Variables and environmental variables.

The environmental variables come in the shape of `.env.*` files. These include a `.env.development` and `.env.production` files. \
These files hold relevant project environmental variables. This is not the most secure way of storing secrets but is effective for the purposes of this project. For obvious reasons (security), these files have been excluded from this project's git history.

An example of an `.env` file has been provided below, for educational purposes.

```script
ENV="development"
IMPORTANT_URL="http://127.0.0.1:1800"
AUTHENTICATION="AUTHENTICATION"
OTHER_SECRET_TOKENS="OTHER SECRET TOKENS"
```

This project is heavily reliant on AWS (Amazon Web Services).

## GitHub Workflow

Multiple GitHub Workflow .yaml files exist in this project's GitHub _workflow_ folder. \
Workflows are utilised to reduce repetitive actions. They allow me to deploy this project to AWS when set requirements are met. 

In the future, testing yaml workflow files will be added to verify the stability of the application.