"""
AI fault diagnosis using the Anthropic streaming API.
Called by the /diagnose endpoint in server.py.
"""

import os
from typing import AsyncIterator

import anthropic

JOINT_NAMES = ["Base (J0)", "Shoulder (J1)", "Elbow (J2)", "Wrist 1 (J3)", "Wrist 2 (J4)", "Wrist 3 (J5)"]

SYSTEM_PROMPT = """\
You are an expert UR5 industrial robot technician diagnosing faults on a factory floor.
Respond concisely in this exact markdown format — no other text:

## Likely Causes
- [most probable cause]
- [second cause]
- [third cause if applicable]

## Recommended Actions
- [immediate action]
- [follow-up action]
- [preventive measure]

## Confidence
**[high / medium / low]** — [one-sentence reason]
"""


async def stream_diagnosis(fault: dict, recent_states: list[dict]) -> AsyncIterator[str]:
    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        # Graceful degradation — yield a mock response so the UI still works without a key
        yield _mock_response(fault)
        return

    client = anthropic.AsyncAnthropic(api_key=api_key)

    joint_idx = fault.get("jointIndex", -1)
    joint_name = JOINT_NAMES[joint_idx] if 0 <= joint_idx < 6 else "unknown"

    # Summarise recent telemetry — last 10 states (~330 ms)
    recent_summary = ""
    if recent_states:
        sample = recent_states[-10:]
        pos_lines = []
        for s in sample:
            joints = s.get("joints", {}).get("positions", [])
            pos_lines.append("[" + ", ".join(f"{p:.2f}" for p in joints) + "]")
        recent_summary = f"Last {len(sample)} joint position snapshots (rad):\n" + "\n".join(pos_lines)

    user_msg = f"""\
Fault alert on UR5 robot arm:

**Fault code:** {fault.get("code", "UNKNOWN")}
**Message:** {fault.get("message", "")}
**Affected joint:** {joint_name}
**Robot status at fault:** {fault.get("status", "FAULTED")}

{recent_summary}

Diagnose this fault and provide corrective actions for the cell operator.
"""

    async with client.messages.stream(
        model="claude-opus-4-6",
        max_tokens=600,
        system=SYSTEM_PROMPT,
        messages=[{"role": "user", "content": user_msg}],
    ) as stream:
        async for text in stream.text_stream:
            yield text


def _mock_response(fault: dict) -> str:
    code = fault.get("code", "UNKNOWN")
    return f"""\
## Likely Causes
- Excessive load or sudden deceleration triggered the {code} safety threshold
- Worn joint bearings increasing friction and apparent torque
- Incorrect payload configuration in the robot controller

## Recommended Actions
- Clear the fault and inspect the affected joint for mechanical resistance
- Verify payload weight and centre-of-mass settings match the physical part
- Run a slow-speed test cycle and monitor torque readings in the telemetry panel

## Confidence
**medium** — No ANTHROPIC_API_KEY set; this is a static mock response. Set the key for real AI diagnosis.
"""
