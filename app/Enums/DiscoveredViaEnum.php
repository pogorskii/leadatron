<?php

namespace App\Enums;

enum DiscoveredViaEnum: int
{
    case GoogleMaps = 1;
    case Instagram = 2;
    case Facebook = 3;
    case Website = 4;
    case Referral = 5;
    case DirectSearch = 6;
    case Advertisement = 7;
    case Other = 8;
}
