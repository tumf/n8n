import {
	IHookFunctions,
	IWebhookFunctions,
} from 'n8n-core';

import {
	IDataObject,
	INodeType,
	INodeTypeDescription,
	IWebhookResponseData,
} from 'n8n-workflow';

import {
	githubApiRequest,
} from './GenericFunctions';


export class GithubTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Github Trigger',
		name: 'githubTrigger',
		icon: 'file:github.svg',
		group: ['trigger'],
		version: 1,
		subtitle: '={{$parameter["owner"] + "/" + $parameter["repository"] + ": " + $parameter["events"].join(", ")}}',
		description: 'Starts the workflow when a Github events occurs.',
		defaults: {
			name: 'Github Trigger',
			color: '#000000',
		},
		inputs: [],
		outputs: ['main'],
		credentials: [
			{
				name: 'githubApi',
				required: true,
				displayOptions: {
					show: {
						authentication: [
							'accessToken',
						],
					},
				},
			},
			{
				name: 'githubOAuth2Api',
				required: true,
				displayOptions: {
					show: {
						authentication: [
							'oAuth2',
						],
					},
				},
			},
		],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
			},
		],
		properties: [
			{
				displayName: 'Authentication',
				name: 'authentication',
				type: 'options',
				options: [
					{
						name: 'Access Token',
						value: 'accessToken',
					},
					{
						name: 'OAuth2',
						value: 'oAuth2',
					},
				],
				default: 'accessToken',
				description: 'The resource to operate on.',
			},
			{
				displayName: 'Repository Owner',
				name: 'owner',
				type: 'string',
				default: '',
				required: true,
				placeholder: 'n8n-io',
				description: 'Owner of the repsitory.',
			},
			{
				displayName: 'Repository Name',
				name: 'repository',
				type: 'string',
				default: '',
				required: true,
				placeholder: 'n8n',
				description: 'The name of the repsitory.',
			},
			{
				displayName: 'Events',
				name: 'events',
				type: 'multiOptions',
				options: [
					{
						name: '*',
						value: '*',
						description: 'Any time any event is triggered (Wildcard Event).',
					},
					{
						name: 'check_run',
						value: 'check_run',
						description: 'Triggered when a check run is created, rerequested, completed, or has a requested_action.',
					},
					{
						name: 'check_suite',
						value: 'check_suite',
						description: 'Triggered when a check suite is completed, requested, or rerequested.',
					},
					{
						name: 'commit_comment',
						value: 'commit_comment',
						description: 'Triggered when a commit comment is created.',
					},
					{
						name: 'content_reference',
						value: 'content_reference',
						description: 'Triggered when the body or comment of an issue or pull request includes a URL that matches a configured content reference domain. Only GitHub Apps can receive this event.',
					},
					{
						name: 'create',
						value: 'create',
						description: 'Represents a created repository, branch, or tag.',
					},
					{
						name: 'delete',
						value: 'delete',
						description: 'Represents a deleted branch or tag.',
					},
					{
						name: 'deploy_key',
						value: 'deploy_key',
						description: 'Triggered when a deploy key is added or removed from a repository.',
					},
					{
						name: 'deployment',
						value: 'deployment',
						description: 'Represents a deployment.',
					},
					{
						name: 'deployment_status',
						value: 'deployment_status',
						description: 'Represents a deployment status.',
					},
					{
						name: 'fork',
						value: 'fork',
						description: 'Triggered when a user forks a repository.',
					},
					{
						name: 'github_app_authorization',
						value: 'github_app_authorization',
						description: 'Triggered when someone revokes their authorization of a GitHub App.',
					},
					{
						name: 'gollum',
						value: 'gollum',
						description: 'Triggered when a Wiki page is created or updated.',
					},
					{
						name: 'installation',
						value: 'installation',
						description: 'Triggered when someone installs (created) , uninstalls (deleted), or accepts new permissions (new_permissions_accepted) for a GitHub App. When a GitHub App owner requests new permissions, the person who installed the GitHub App must accept the new permissions request.',
					},
					{
						name: 'installation_repositories',
						value: 'installation_repositories',
						description: 'Triggered when a repository is added or removed from an installation.',
					},
					{
						name: 'issue_comment',
						value: 'issue_comment',
						description: 'Triggered when an issue comment is created, edited, or deleted.',
					},
					{
						name: 'issues',
						value: 'issues',
						description: 'Triggered when an issue is opened, edited, deleted, transferred, pinned, unpinned, closed, reopened, assigned, unassigned, labeled, unlabeled, locked, unlocked, milestoned, or demilestoned.',
					},
					{
						name: 'label',
						value: 'label',
						description: 'Triggered when a repository\'s label is created, edited, or deleted.',
					},
					{
						name: 'marketplace_purchase',
						value: 'marketplace_purchase',
						description: 'Triggered when someone purchases a GitHub Marketplace plan, cancels their plan, upgrades their plan (effective immediately), downgrades a plan that remains pending until the end of the billing cycle, or cancels a pending plan change.',
					},
					{
						name: 'member',
						value: 'member',
						description: 'Triggered when a user accepts an invitation or is removed as a collaborator to a repository, or has their permissions changed.',
					},
					{
						name: 'membership',
						value: 'membership',
						description: 'Triggered when a user is added or removed from a team. Organization hooks only.',
					},
					{
						name: 'meta',
						value: 'meta',
						description: 'Triggered when the webhook that this event is configured on is deleted.',
					},
					{
						name: 'milestone',
						value: 'milestone',
						description: 'Triggered when a milestone is created, closed, opened, edited, or deleted.',
					},
					{
						name: 'organization',
						value: 'organization',
						description: 'Triggered when an organization is deleted and renamed, and when a user is added, removed, or invited to an organization. Organization hooks only.',
					},
					{
						name: 'org_block',
						value: 'org_block',
						description: 'Triggered when an organization blocks or unblocks a user. Organization hooks only.',
					},
					{
						name: 'page_build',
						value: 'page_build',
						description: 'Triggered on push to a GitHub Pages enabled branch (gh-pages for project pages, master for user and organization pages).',
					},
					{
						name: 'project_card',
						value: 'project_card',
						description: 'Triggered when a project card is created, edited, moved, converted to an issue, or deleted.',
					},
					{
						name: 'project_column',
						value: 'project_column',
						description: 'Triggered when a project column is created, updated, moved, or deleted.',
					},
					{
						name: 'project',
						value: 'project',
						description: 'Triggered when a project is created, updated, closed, reopened, or deleted.',
					},
					{
						name: 'public',
						value: 'public',
						description: 'Triggered when a private repository is open sourced.',
					},
					{
						name: 'pull_request',
						value: 'pull_request',
						description: 'Triggered when a pull request is assigned, unassigned, labeled, unlabeled, opened, edited, closed, reopened, synchronize, ready_for_review, locked, unlocked, a pull request review is requested, or a review request is removed.',
					},
					{
						name: 'pull_request_review',
						value: 'pull_request_review',
						description: 'Triggered when a pull request review is submitted into a non-pending state, the body is edited, or the review is dismissed.',
					},

					{
						name: 'pull_request_review_comment',
						value: 'pull_request_review_comment',
						description: 'Triggered when a comment on a pull request\'s unified diff is created, edited, or deleted (in the Files Changed tab).',
					},
					{
						name: 'push',
						value: 'push',
						description: 'Triggered on a push to a repository branch. Branch pushes and repository tag pushes also trigger webhook push events. This is the default event.',
					},
					{
						name: 'release',
						value: 'release',
						description: 'Triggered when a release is published, unpublished, created, edited, deleted, or prereleased.',
					},
					{
						name: 'repository',
						value: 'repository',
						description: 'Triggered when a repository is created, archived, unarchived, renamed, edited, transferred, made public, or made private. Organization hooks are also triggered when a repository is deleted.',
					},
					{
						name: 'repository_import',
						value: 'repository_import',
						description: 'Triggered when a successful, cancelled, or failed repository import finishes for a GitHub organization or a personal repository.',
					},
					{
						name: 'repository_vulnerability_alert',
						value: 'repository_vulnerability_alert',
						description: 'Triggered when a security alert is created, dismissed, or resolved.',
					},
					{
						name: 'security_advisory',
						value: 'security_advisory',
						description: 'Triggered when a new security advisory is published, updated, or withdrawn.',
					},
					{
						name: 'star',
						value: 'star',
						description: 'Triggered when a star is added or removed from a repository.',
					},
					{
						name: 'status',
						value: 'status',
						description: 'Triggered when the status of a Git commit changes.',
					},
					{
						name: 'team',
						value: 'team',
						description: 'Triggered when an organization\'s team is created,<br/>deleted, edited, added_to_repository, or removed_from_repository. Organization hooks only',
					},
					{
						name: 'team_add',
						value: 'team_add',
						description: 'Triggered when a repository is added to a team.',
					},
					{
						name: 'watch',
						value: 'watch',
						description: 'Triggered when someone stars a repository.',
					},
				],
				required: true,
				default: [],
				description: 'The events to listen to.',
			},
		],
	};

	// @ts-ignore (because of request)
	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');

				if (webhookData.webhookId === undefined) {
					// No webhook id is set so no webhook can exist
					return false;
				}

				// Webhook got created before so check if it still exists
				const owner = this.getNodeParameter('owner') as string;
				const repository = this.getNodeParameter('repository') as string;
				const endpoint = `/repos/${owner}/${repository}/hooks/${webhookData.webhookId}`;

				try {
					await githubApiRequest.call(this, 'GET', endpoint, {});
				} catch (e) {
					if (e.message.includes('[404]:')) {
						// Webhook does not exist
						delete webhookData.webhookId;
						delete webhookData.webhookEvents;

						return false;
					}

					// Some error occured
					throw e;
				}

				// If it did not error then the webhook exists
				return true;
			},
			async create(this: IHookFunctions): Promise<boolean> {
				const webhookUrl = this.getNodeWebhookUrl('default') as string;

				if (webhookUrl.includes('//localhost')) {
					throw new Error('The Webhook can not work on "localhost". Please, either setup n8n on a custom domain or start with "--tunnel"!');
				}

				const owner = this.getNodeParameter('owner') as string;
				const repository = this.getNodeParameter('repository') as string;
				const events = this.getNodeParameter('events', []);

				const endpoint = `/repos/${owner}/${repository}/hooks`;

				const body = {
					name: 'web',
					config: {
						url: webhookUrl,
						content_type: 'json',
						// secret: '...later...',
						insecure_ssl: '1', // '0' -> not allow inscure ssl | '1' -> allow insercure SSL
					},
					events,
					active: true,
				};

				const webhookData = this.getWorkflowStaticData('node');

				let responseData;
				try {
					responseData = await githubApiRequest.call(this, 'POST', endpoint, body);
				} catch (e) {
					if (e.message.includes('[422]:')) {
						// Webhook exists already

						// Get the data of the already registered webhook
						responseData = await githubApiRequest.call(this, 'GET', endpoint, body);

						for (const webhook of responseData as IDataObject[]) {
							if ((webhook!.config! as IDataObject).url! === webhookUrl) {
								// Webhook got found
								if (JSON.stringify(webhook.events) === JSON.stringify(events)) {
									// Webhook with same events exists already so no need to
									// create it again simply save the webhook-id
									webhookData.webhookId = webhook.id as string;
									webhookData.webhookEvents = webhook.events as string[];
									return true;
								}
							}
						}

						throw new Error('A webhook with the identical URL probably exists already. Please delete it manually on Github!');
					}

					throw e;
				}

				if (responseData.id === undefined || responseData.active !== true) {
					// Required data is missing so was not successful
					throw new Error('Github webhook creation response did not contain the expected data.');
				}

				webhookData.webhookId = responseData.id as string;
				webhookData.webhookEvents = responseData.events as string[];

				return true;
			},
			async delete(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');

				if (webhookData.webhookId !== undefined) {
					const owner = this.getNodeParameter('owner') as string;
					const repository = this.getNodeParameter('repository') as string;
					const endpoint = `/repos/${owner}/${repository}/hooks/${webhookData.webhookId}`;
					const body = {};

					try {
						await githubApiRequest.call(this, 'DELETE', endpoint, body);
					} catch (e) {
						return false;
					}

					// Remove from the static workflow data so that it is clear
					// that no webhooks are registred anymore
					delete webhookData.webhookId;
					delete webhookData.webhookEvents;
				}

				return true;
			},
		},
	};



	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const bodyData = this.getBodyData();

		// Check if the webhook is only the ping from Github to confirm if it workshook_id
		if (bodyData.hook_id !== undefined && bodyData.action === undefined) {
			// Is only the ping and not an actual webhook call. So return 'OK'
			// but do not start the workflow.

			return {
				webhookResponse: 'OK',
			};
		}

		// Is a regular webhoook call

		// TODO: Add headers & requestPath
		const returnData: IDataObject[] = [];

		returnData.push(
			{
				body: bodyData,
				headers: this.getHeaderData(),
				query: this.getQueryData(),
			},
		);

		return {
			workflowData: [
				this.helpers.returnJsonArray(returnData),
			],
		};
	}
}
