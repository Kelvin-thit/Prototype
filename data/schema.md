# CreatorXchange Data Contract & API Schema
Version: 1.0.0 (Tech A & Tech B Shared Agreement)

## Overview
CreatorXchange connects live Google Search and YouTube trend signals with opt-in creator profiles and brand campaign intents. All data exchange between data pipelines (Tech A) and the web application (Tech B) follows these strict JSON contracts.

---

## 1. Trends (`/data/trends.json` or `GET /api/trends`)

```json
[
  {
    "id": "run-club",
    "name": "Run Club Socials",
    "growth_7d": 3.2,
    "growth_30d": 5.4,
    "search_interest": 94,
    "yt_interest": 88,
    "state": "accelerating",
    "category": "Fitness & Lifestyle",
    "summary": "Weekend morning running clubs doubling as social hubs and community coffee meetups.",
    "evidence": [
      "+320% breakout query 'run club near me singles'",
      "YouTube vlog uploads with #RunClub up 4.1x in 30 days",
      "Average watch duration 82% higher than standard fitness vlogs"
    ]
  }
]
```

### Trend States
- `accelerating`: Rapid upward trajectory in search volume and video views over 7 days.
- `surging`: High-velocity breakout with steep day-over-day acceleration.
- `sustained`: High consistent baseline interest spanning multiple weeks.
- `peaking`: Top of curve; urgent 48-72h window before saturation.

---

## 2. Creators (`/data/creators.json` or `GET /api/creators`)

```json
[
  {
    "id": "c01",
    "name": "Taylor K.",
    "channel_name": "Taylor Runs",
    "channel_url": "https://youtube.com/@taylorruns",
    "subscribers": 210000,
    "tier": "mid-size",
    "thumbnail": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop&crop=faces",
    "category": "Running & Community",
    "worked_with_brand": false,
    "opted_in": true,
    "sponsored_videos_analyzed": 5,
    "sponsors": [
      {
        "brand": "Stride & Co.",
        "date": "2026-07-24",
        "video_id": "v_tk_01",
        "title": "My First 20-Mile Week with Sunday Run Club",
        "sponsor_brand": "Stride & Co.",
        "is_repeat_sponsor": true,
        "is_competitor": false
      },
      {
        "brand": "MyProtein",
        "date": "2026-06-12",
        "video_id": "v_tk_02",
        "title": "What I Eat in a Day as a Marathoner",
        "sponsor_brand": "MyProtein",
        "is_repeat_sponsor": false,
        "is_competitor": true
      }
    ],
    "scores": {
      "reception": 82,
      "fit": 76,
      "lead_time_days": 11,
      "authentic_pct": 91
    },
    "intent_mix": {
      "question": 0.34,
      "endorsement": 0.22,
      "purchase": 0.14,
      "annoyance": 0.30
    },
    "evidence_comments": [
      {
        "text": "Already ordered using your discount code! The hydration pack fits so well.",
        "label": "purchase",
        "timestamp": "2 days ago",
        "likes": 42
      },
      {
        "text": "Does the electrolyte berry mix have artificial sweeteners?",
        "label": "question",
        "timestamp": "5 days ago",
        "likes": 19
      }
    ],
    "ad_analysis": {
      "style": "story-woven",
      "avg_length_sec": 38,
      "placement": "mid-roll",
      "insight": "Seamlessly integrates product while warming up before 6am group run. Zero scripted stiffness.",
      "segments": [
        {
          "video_id": "v_tk_01",
          "start": "2:14",
          "end": "2:52"
        }
      ]
    }
  }
]
```

---

## 3. Gemini Brief Generation API

### `POST /api/brief`

Accepts campaign brief context, a trend identifier, and a target creator identifier.
Returns an actionable, bilateral campaign brief scored on real audience signals.

#### Request Payload
```json
{
  "campaign": {
    "brand_name": "Stride & Co.",
    "product_name": "AeroFoam Long-Run Recovery Shoe & Hydration Pack",
    "core_goal": "Drive authentic trial among weekend community runners during rising Run Club trend",
    "budget_range": "$3,000 - $6,000",
    "target_audience": "Urban 22-35 active adults entering half-marathon / 10k clubs"
  },
  "trend_id": "run-club",
  "creator_id": "c01"
}
```

#### Response Payload (Strict Schema)
```json
{
  "trend_card": {
    "trend_id": "run-club",
    "trend_name": "Run Club Socials",
    "growth_label": "+320% this week",
    "cultural_context": "Run clubs have become the new third place for young urban professionals, blending fitness with casual dating and breakfast hangs."
  },
  "key_messages": [
    "Ground the shoe review in an actual 7:00 AM Sunday group run, highlighting zero break-in blisters",
    "Address the top audience question about heel lockdown during 10K group paces",
    "Provide a natural opt-in community perk (e.g. first 50 runners get free pack accessories)"
  ],
  "guardrails": [
    "Do NOT read off a corporate spec sheet or use standard ad jargon like 'game changer'",
    "Do NOT force a standalone product pedestal shot; keep camera moving with the pack",
    "Avoid claiming medical injury prevention; focus on subjective cushion feel and energy return"
  ],
  "format": "story-woven 45s mid-roll inside morning vlog preparation",
  "post_window": "Thursday - Saturday morning (prior to 8am weekend group runs)",
  "outreach_message": "Hey Taylor — loved your Sunday 20-miler vlog with the Brooklyn club! Run club search volume is up 320% this week and Stride & Co. would love to support your next group meet with AeroFoam pairs for you and your pacers. Check out the shared brief in CreatorXchange and opt in if this feels natural for your community!",
  "send_time": "Tuesday 10:15 AM EDT (Creator's historically highest response window)",
  "deal_type": "paid_now",
  "deal_reason": "High Audience Trust Score (82/100) and 14% direct purchase intent in comments justifies immediate upfront paid tier with zero risk."
}
```

### Deal Types:
- `paid_now`: Immediate upfront fee. Creator has verified high trust (>75) and proven purchase intent.
- `test_first`: Product gifting + performance affiliate or milestone bonus. Recommended when fit is moderate or creator is untested in product category.
- `small_test_bonus`: Fixed modest fee plus tiered conversion bonus on comment discount code redemptions. Recommended for high reach with lower trust verification.
