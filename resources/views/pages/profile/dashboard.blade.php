@extends('layouts.app')

@section('content')
<!-- React Component -->
<div data-notifications="{{!empty($notifications) ? $notifications : null}}" id="dashboard"></div>
@endsection
