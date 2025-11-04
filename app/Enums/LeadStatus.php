<?php

namespace App\Enums;

enum LeadStatus: int
{
    case New = 0;
    case Contacted = 1;
    case Qualified = 2;
    case Negotiating = 3;
    case Won = 4;
    case Lost = 5;
    case Archived = 6;
}
