import { NextResponse } from "next/server";
import { AUTOMATION_WORKFLOWS } from "@/app/lib/ghl-automation-utils.js";

export async function GET() {
    return NextResponse.json({
        message: 'GHL Automation Webhook test endpoint is working',
        endpoint: '/api/webhooks/ghl-subscription',
        method: 'POST',
        description: 'Send webhook events to this endpoint to test subscription automation workflows',
        availableWorkflows: Object.keys(AUTOMATION_WORKFLOWS).map(trigger => ({
            trigger,
            name: AUTOMATION_WORKFLOWS[trigger].name,
            description: AUTOMATION_WORKFLOWS[trigger].description,
            actions: AUTOMATION_WORKFLOWS[trigger].actions.map(action => ({
                name: action.name,
                description: action.description
            }))
        }))
    });
}

export async function POST(request) {
    try {
        const body = await request.text();
        const payload = JSON.parse(body);

        console.log('Test automation webhook received:', JSON.stringify(payload, null, 2));

        // Simulate automation workflow execution
        const eventType = payload.event || payload.type || payload.action;
        const workflow = AUTOMATION_WORKFLOWS[eventType];

        if (workflow) {
            console.log(`Would execute workflow: ${workflow.name}`);
            console.log(`Actions to execute: ${workflow.actions.length}`);

            workflow.actions.forEach((action, index) => {
                console.log(`${index + 1}. ${action.name}: ${action.description}`);
            });
        } else {
            console.log(`No automation workflow found for event: ${eventType}`);
        }

        return NextResponse.json({
            message: 'Test automation webhook received successfully',
            receivedData: payload,
            timestamp: new Date().toISOString(),
            automationWorkflow: workflow ? {
                name: workflow.name,
                description: workflow.description,
                actionsCount: workflow.actions.length
            } : null
        });
    } catch (error) {
        console.error('Error in test automation webhook:', error);
        return NextResponse.json({
            error: 'Invalid JSON payload'
        }, { status: 400 });
    }
} 